// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

/*
eslint-disable
no-param-reassign,
import/no-extraneous-dependencies,
import/no-unresolved,
import/extensions
*/

import { fromEvent } from 'rxjs/observable/fromEvent';

import { _catch as recover } from 'rxjs/operator/catch';
import { _do as effect } from 'rxjs/operator/do';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { exhaustMap } from 'rxjs/operator/exhaustMap';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { pairwise } from 'rxjs/operator/pairwise';
import { share } from 'rxjs/operator/share';
import { startWith } from 'rxjs/operator/startWith';
import { switchMap } from 'rxjs/operator/switchMap';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { zipProto as zipWith } from 'rxjs/operator/zip';

import PushState from 'y-push-state/src/vanilla';
import elemDataset from 'elem-dataset';

import { hasFeatures, animate } from './common';
import CrossFader from './cross-fader';
import upgradeMathBlocks from './katex';
import { op, pipe } from './rxjs-helpers';

import Flip from './flip/flip';
import './flip/title';

const REQUIREMENTS = [
  'eventlistener',
  'queryselector',
  'requestanimationframe',
  'classlist',
  'documentfragment',
  'history',
  'opacity',
  'cssanimations',
];

const DURATION = 250;
const FADE_DURATION = 500;

// whenever the source observable encounters an error,
// we log it to the console, but continue as if it never happend
function makeUnstoppable(source) {
  return recover.call(source, (error, caught) => {
    console.error(error); // eslint-disable-line
    return caught;
  });
}

if (!window.disablePushState && hasFeatures(REQUIREMENTS)) {
  const ua = navigator.userAgent.toLowerCase();
  const isSafari = ua.indexOf('safari') > 0 && ua.indexOf('chrome') < 0;

  const crossFader = new CrossFader({ duration: FADE_DURATION });

  const pushState = document.getElementById('_yPushState');

  const animationMain = document.createElement('div');
  animationMain.classList.add('animation-main');
  animationMain.classList.add('fixed-top');
  animationMain.innerHTML = `
    <div class="content">
      <div class="page"></div>
    </div>`;
  pushState.parentNode.insertBefore(animationMain, pushState);

  const loading = document.createElement('div');
  loading.classList.add('loading');
  loading.innerHTML = `
    <span class="sr-only">Loading...</span>
    <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
    </div>
  `;
  document.querySelector('.navbar .content').appendChild(loading);

  const start$ = pipe(
    fromEvent(pushState, 'y-push-state-start'),
    op(map, ({ detail }) => detail),
    op(map, detail => [detail, document.getElementById('_main')]),
    op(effect, () => {
      // If a link on the drawer has been clicked, close it
      if (!window.isDesktop && window.drawer.opened) {
        window.drawer.close();
      }
    }),
    op(share),
  );

  const ready$ = pipe(
    fromEvent(pushState, 'y-push-state-ready'),
    op(map, ({ detail }) => detail),
    op(share),
  );

  const progress$ = pipe(
    fromEvent(pushState, 'y-push-state-progress'),
    op(map, ({ detail }) => detail),
  );

  const after$ = pipe(
    fromEvent(pushState, 'y-push-state-after'),
    op(map, ({ detail }) => detail),
    op(share),
  );

  // const error$ = Observable.fromEvent(pushState, 'y-push-state-error');

  // HACK
  if (isSafari) {
    fromEvent(window, 'popstate')
      .subscribe(() => { document.body.style.minHeight = '999999px'; });

    after$
      .subscribe(() => { document.body.style.minHeight = ''; });
  }

  // FLIP animation (when applicable)
  pipe(
    start$,
    op(switchMap, ([detail]) => {
      const { event: { currentTarget } } = detail;

      const flip = Flip.create(
        currentTarget.getAttribute &&
        currentTarget.getAttribute('data-flip'), {
          animationMain,
          currentTarget,
          duration: DURATION,
        });

      // HACK: This assumes knowledge of the internal rx pipeline.
      // Could possibly be replaced with `withLatestFrom` shinanigans,
      // but it's more convenient like that.
      detail.flip = flip;

      return flip.start(currentTarget);
    }),
    makeUnstoppable,
  ).subscribe();

  // Fade main content out
  pipe(
    start$,
    op(effect, ([, main]) => { main.style.opacity = 0; }),
    op(filter, ([{ type }]) => type === 'push' || !isSafari),
    op(exhaustMap, ([{ type }, main]) => pipe(
      animate(main, [
        { opacity: 1 },
        { opacity: 0 },
      ], {
        duration: DURATION,
        // easing: 'ease',
        easing: 'cubic-bezier(0,0,0.32,1)',
      }),
      op(effect, () => { if (type === 'push') window.scroll(0, 0); }),
      op(zipWith, after$),
    )),
    makeUnstoppable,
  ).subscribe();

  // Show loading bar when taking longer than expected
  pipe(
    progress$,
    op(effect, () => { loading.style.display = 'block'; }),
    makeUnstoppable,
  ).subscribe();

  // TODO: error message!?
  // error$
  //   // .delay(DURATION) // HACK
  //   .do(() => {
  //     loading.style.display = 'none';
  //   })
  //   .subscribe();

  // Prepare showing the new content
  pipe(
    ready$,
    op(effect, () => { loading.style.display = 'none'; }),
    op(filter, ({ type }) => type === 'push' || !isSafari),
    op(switchMap, ({ flip, content: [main] }) => pipe(
      flip.ready(main),
      op(takeUntil, start$),
    )),
    makeUnstoppable,
  ).subscribe();

  pipe(
    ready$,
    op(switchMap, ({ content: [main] }) => pipe(
      crossFader.fetchImage(elemDataset(main)),
      op(takeUntil, start$),
    )),
    op(startWith, document.querySelector('.sidebar-bg')),
    op(pairwise),
    op(mergeMap, crossFader.crossFade.bind(crossFader)),
    makeUnstoppable,
  ).subscribe();

  // Animate the new content
  pipe(
    after$,
    op(filter, ({ type }) => type === 'push' || !isSafari),
    op(map, kind => [kind, document.querySelector('main')]),
    op(switchMap, ([, main]) => animate(main, [
      { transform: 'translateY(-2rem)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 },
    ], {
      duration: DURATION,
      // easing: 'ease',
      easing: 'cubic-bezier(0,0,0.32,1)',
    })),
    makeUnstoppable,
  ).subscribe();

  pipe(
    after$,
    // Don't send a pageview when the user blasts through the history..
    op(debounceTime, 2 * DURATION),
    op(effect, () => {
      // Send google analytics pageview
      if (window.ga) window.ga('send', 'pageview');

      // Upgrade math blocks
      upgradeMathBlocks();
    }),
    makeUnstoppable,
  ).subscribe();

  new PushState(pushState, {
    replaceIds: ['_main'],
    linkSelector: 'a[href^="/"]',
    scriptSelector: 'script:not([type^="math/tex"])',
    duration: DURATION,
    noPopDuration: isSafari,
    scrollRestoration: !isSafari,
  }).startHistory();
}
