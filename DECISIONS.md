# Candidate Decisions & Notes

Please use this file to briefly outline your technical choices and the rationale behind them.

## 1. State Management & Architecture

_Why did you structure your state the way you did? Which patterns did you choose for handling the flaky API
requests, loading states, and error handling?_

I kept the app state local to `App.tsx` because this task is one page and one feature, so global state was not
needed.

I separated state into small parts so it is easy to understand and debug:

- product data state (`products`, `total`, `totalPages`)
- user query state (`search`, `category`, `page`)
- request state (`isLoading`, `isRefreshing`, `error`)

For flaky API handling, I used simple but practical patterns:

- debounced search input (avoid API call on every key press)
- one automatic retry for temporary failure
- stale response guard (old slow request cannot override latest request)
- different UI states for better user experience:
  - full loading state
  - soft error while keeping old data visible
  - hard error when no data is available
  - empty state when no match is found

My goal was to keep user experience stable even when backend is slow or unstable, and keep code readable for
team maintenance.

## 2. Trade-offs and Omissions

_What did you intentionally leave out given the constraints of a take-home assignment? If you had more time,
what would you prioritize next?_

For this take-home task, I focused on core functionality first, not extra features. My main priority was
stable product fetch flow, error handling, and clear user states.

I intentionally left out:

- global state library (because this is a single-page feature)
- unit/integration test setup (time was limited)
- advanced caching and advanced retry strategy
- heavy animation and micro-interaction polish
- deeper accessibility audit for every edge case

If I had more time, I would prioritize:

- writing tests for API retry, stale response guard, and pagination
- improving mobile responsiveness for very small devices
- reducing repeated inline styles into cleaner reusable style patterns
- adding stronger resilience patterns (exponential backoff + jitter, circuit breaker)
- final accessibility pass (keyboard navigation, focus order, screen reader feedback)

My trade-off was: first make the app reliable and readable, then improve scalability and polish.

## 3. AI Usage

_How did you utilize AI tools (ChatGPT, Copilot, Cursor, etc.) during this assignment? Provide a brief summary
of how they assisted you._

Last two days I was in Chittagong for assisting an AI workshop. I did not bring my personal laptop there, so I
started this task after I came back on the night of 30th.

Because of limited time, I used AI tools to move faster and also to understand the algorithm options. There
are many possible algorithms for this kind of solution, but I selected one practical approach for this task
and implemented it.

I did not fully depend on AI. I used AI for support when I got stuck:

- Copilot for faster coding and refactoring
- ChatGPT when I faced errors or needed debugging help
- Claude sometimes for alternate explanation and comparison

Also, I did not have full clear Figma details for some state components. For that part, I shared my idea/thought process with Claude, and Claude helped me generate a starting component structure. Then I adjusted it in my code.

I can use Tailwind CSS, but in this boilerplate most styling was already inline CSS pattern. So I followed the same pattern to keep code style consistent.

Final decisions and code selection were done by me after reviewing the suggestions.

## 4. Edge Cases Identified

_Did you notice any edge cases or bugs that you didn't have time to fix? Please list them here._

Yes, I noticed some edge cases, but due to time I could not fully fix all of them:

- if user changes search/category very fast many times, too many requests can still happen
- retry strategy is basic (single retry); advanced retry with backoff can be better
- image loading failure is not handled with fallback image
- pagination can be improved more for very large page numbers (first/last or jump logic)
- mobile spacing is good for common screens, but can be improved more for very small devices
- accessibility can be improved more (better keyboard flow and stronger focus indicators)

These are not blocking for core functionality, but they are important for production-level polish.
