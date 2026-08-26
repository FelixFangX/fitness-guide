import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('Chinese personal-training home is the default and has no detectable accessibility violations', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { name: '今天，只完成下一组。' })).toBeVisible();
  await expect(page.getByLabel('主导航').getByRole('link', { name: '今日训练' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/fitness-guide/en/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('movement illustrations loop through SVG frames when motion is allowed', async ({ page }) => {
  await page.goto('./exercises/push-up/');
  const illustration = page.locator('[data-motion-illustration]').first();
  await expect(illustration).toHaveAttribute('data-motion-frames', /frame-1\.svg.*frame-2\.svg.*frame-3\.svg.*frame-2\.svg/);
  const initialSource = await illustration.getAttribute('src');
  await expect.poll(() => illustration.getAttribute('src'), { timeout: 1600 }).not.toBe(initialSource);
});

test('movement illustrations respect reduced-motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./exercises/push-up/');
  const illustration = page.locator('[data-motion-illustration]').first();
  const initialSource = await illustration.getAttribute('src');
  await page.waitForTimeout(1400);
  await expect(illustration).toHaveAttribute('src', initialSource!);
});

test('plan selection opens the chosen session and completed sets persist after reload', async ({ page }) => {
  await page.goto('./plan/');
  await page.getByRole('link', { name: '开始此训练' }).nth(1).click();
  await expect(page.getByRole('heading', { name: '拉力与单腿' })).toBeVisible();
  const completeSet = page.locator('[data-workout-session]:not([hidden]) [data-complete-set]').first();
  await completeSet.click();
  await expect(completeSet).toHaveText('完成一组 · 1/3');
  await page.reload();
  await expect(page.getByRole('heading', { name: '拉力与单腿' })).toBeVisible();
  await expect(page.getByRole('button', { name: '完成一组 · 1/3' }).first()).toBeVisible();
});

test('Chinese movement search persists in the URL and language switching keeps the query', async ({ page }) => {
  await page.goto('./exercises/');
  const search = page.getByRole('searchbox');
  await search.fill('门框划船');
  await expect(page.locator('[data-exercise-card]:visible')).toHaveCount(1);
  await expect(page.locator('#result-count')).toContainText('找到 1 个动作');
  await expect(page).toHaveURL(/q=%E9%97%A8%E6%A1%86%E5%88%92%E8%88%B9/);
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/en\/exercises\/\?q=%E9%97%A8%E6%A1%86%E5%88%92%E8%88%B9/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(search).toHaveValue('门框划船');
});

test('movement detail shows SVG positions and its plan placement', async ({ page }) => {
  await page.goto('./exercises/push-up/');
  await expect(page.getByRole('heading', { name: '俯卧撑', exact: true })).toBeVisible();
  await expect(page.locator('.frame-card')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: '出现在默认计划中' })).toBeVisible();
  await page.goto('./en/exercises/push-up/');
  await expect(page.getByRole('heading', { name: 'Push-up', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Included in the default plan' })).toBeVisible();
});

test('desktop, iPad, and mobile layouts keep actions accessible without horizontal overflow', async ({ page }, testInfo) => {
  await page.goto('./exercises/');
  const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
  const searchFontSize = await page.getByRole('searchbox').evaluate((input) => Number.parseFloat(getComputedStyle(input).fontSize));
  expect(searchFontSize).toBeGreaterThanOrEqual(testInfo.project.name === 'mobile-safari' ? 16 : 14);
  const expectedColumns = testInfo.project.name === 'desktop-chromium' ? 5 : testInfo.project.name === 'tablet-safari' ? 3 : 2;
  const columns = await page.locator('[data-exercise-grid]').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length);
  expect(columns).toBe(expectedColumns);
  const headerLinkHeights = await page.locator('.site-header a').evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().height)));
  expect(headerLinkHeights.every((height) => height >= 40)).toBe(true);
  const footerLinkHeights = await page.locator('.site-footer a').evaluateAll((links) => links.map((link) => Math.round(link.getBoundingClientRect().height)));
  expect(footerLinkHeights.every((height) => height >= 44)).toBe(true);
});
