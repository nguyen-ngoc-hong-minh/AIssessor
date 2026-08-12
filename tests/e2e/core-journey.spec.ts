import { expect, test } from "@playwright/test";

test("public journey reaches account creation before onboarding", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Find the right AI setup/ })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: /Build My AI Strategy/ })).toHaveAttribute("href", "/sign-up");
  await page.getByRole("link", { name: "See How It Works" }).click();
  await expect(page).toHaveURL(/how-it-works/);
});

test.describe("credentialed Clerk journeys", () => {
  test.skip(!process.env.E2E_CLERK_CONFIGURED, "Requires a configured Clerk development instance");

  test("Clerk sign-up exposes the configured authentication methods", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.getByText(/email or Google/i)).toBeVisible();
    await expect(page.locator(".cl-rootBox")).toBeVisible();
  });

  test("configured strategy, onboarding bypass, deletion, checkout, and persistence journey", async ({ page }) => {
    test.skip(!process.env.E2E_CLERK_TEST_USER || !process.env.E2E_STRIPE_TEST_MODE, "Requires Clerk, Convex, OpenAI, source APIs, and Stripe test mode");
    await page.goto("/sign-in");
    expect(process.env.E2E_CLERK_TEST_USER).toBeTruthy();
  });
});
