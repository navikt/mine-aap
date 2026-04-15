// --- for å få typescript til å fungere på axe matcheren 'toHaveNoVialations'
import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
// ---

import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import createFetchMock from 'vitest-fetch-mock'; // vitest-setup.js

import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';
expect.extend(matchers);

vi.mock('next/navigation', () => ({
  useParams: vi.fn().mockReturnValue({ referanse: '123', innsendingtype: 'innsending' }),
  useRouter: vi.fn().mockReturnValue({ prefetch: () => null }),
}));

vi.mock('i18n/routing', () => ({
  // Mocker opp Link til å returnere en a tag slik at vi får korrekt rolle i tester
  Link: vi.fn().mockImplementation(({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )),
  redirect: vi.fn(),
  usePathname: vi.fn().mockReturnValue('/sett-inn-riktig-value-her-hvis-det-trengs-en-gang-i-fremtiden'),
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

fetchMocker.mockResponse({ status: 200 });

afterEach(() => {
  cleanup();
});
