"use client";

import { useEffect, useRef } from "react";

export type MicrotestItem = {
  group: string;
  topic: string;
  title: string;
  href: string;
};

export type MicrotestsChooserProps = {
  tests: readonly MicrotestItem[];
  onClose: () => void;
};

const groups = [
  { label: "Микронаблюдения", id: "micro-observations" },
  { label: "Классические опросники", id: "classic-questionnaires" },
] as const;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0 && window.getComputedStyle(element).visibility !== "hidden";
}

export function MicrotestsChooser({ tests, onClose }: MicrotestsChooserProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const rootWasLocked = root.classList.contains("page-locked");
    const bodyWasLocked = body.classList.contains("page-locked");
    const previous = {
      rootOverflow: root.style.overflow,
      rootOverscroll: root.style.overscrollBehavior,
      rootScrollBehavior: root.style.scrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };

    root.classList.add("page-locked");
    body.classList.add("page-locked");
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    root.style.scrollBehavior = "auto";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown, true);

      if (!rootWasLocked) root.classList.remove("page-locked");
      if (!bodyWasLocked) body.classList.remove("page-locked");
      root.style.overflow = previous.rootOverflow;
      root.style.overscrollBehavior = previous.rootOverscroll;
      body.style.overflow = previous.bodyOverflow;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.left = previous.bodyLeft;
      body.style.right = previous.bodyRight;
      body.style.width = previous.bodyWidth;
      body.style.paddingRight = previous.bodyPaddingRight;
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = previous.rootScrollBehavior;

    };
  }, [onClose]);

  return (
    <div
      className="microtests-chooser-shell"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="microtests-chooser-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="microtests-chooser-title"
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          className="microtests-chooser-close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть выбор теста"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="microtests-chooser-intro">
          <p className="microtests-chooser-eyebrow">Бесплатные тесты</p>
          <h2 id="microtests-chooser-title">Что хочется понять о себе сейчас?</h2>
          <p className="microtests-chooser-lead">
            Выберите вопрос, который сейчас откликается. Это способ заметить свои реакции и собрать мысли — не диагноз и не готовый ответ за вас.
          </p>
        </div>

        <div className="microtests-chooser-catalog">
          {groups.map((group) => {
            const groupedTests = tests.filter((test) => test.group === group.label);
            if (groupedTests.length === 0) return null;

            return (
              <section className="microtests-chooser-group" key={group.id} aria-labelledby={`microtests-chooser-group-${group.id}`}>
                <h3 id={`microtests-chooser-group-${group.id}`}>{group.label}</h3>
                <ul className="microtests-chooser-list">
                  {groupedTests.map((test) => (
                    <li key={`${test.group}-${test.href}`}>
                      <a
                        className="microtests-chooser-link"
                        href={test.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                      >
                        <span className="microtests-chooser-topic">{test.topic}</span>
                        <span className="microtests-chooser-question">{test.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
