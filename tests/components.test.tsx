import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthScreen } from "@/components/auth-screen";
import { IntegrationNotice } from "@/components/integration-notice";
import { MonthlyTaskBuilder } from "@/components/monthly-task-builder";
import { OneOffStrategyForm } from "@/components/one-off-strategy-form";
import { OnboardingForm } from "@/components/onboarding-form";

const { routerPush } = vi.hoisted(() => ({ routerPush: vi.fn() }));

vi.mock("@/components/providers", () => ({ authConfigured: true, integrationsConfigured: true }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: routerPush, replace: vi.fn() }), usePathname: () => "/" }));
vi.mock("@clerk/react", () => ({
  SignIn: (props: { fallbackRedirectUrl?: string }) => <div data-testid="clerk-sign-in" data-redirect={props.fallbackRedirectUrl} />,
  SignUp: (props: { forceRedirectUrl?: string }) => <div data-testid="clerk-sign-up" data-redirect={props.forceRedirectUrl} />,
  UserProfile: () => <div data-testid="clerk-user-profile" />,
}));

afterEach(() => {
  vi.restoreAllMocks();
  routerPush.mockReset();
  sessionStorage.clear();
});

describe("IntegrationNotice", () => {
  it("makes missing production configuration explicit", () => { render(<IntegrationNotice />); expect(screen.getByText(/live data services are not configured/i)).toBeInTheDocument(); expect(screen.getByText(/fails closed instead of showing fake/i)).toBeInTheDocument(); });
});

describe("Clerk authentication", () => {
  it("sends new accounts to onboarding", () => { render(<AuthScreen mode="sign-up" />); expect(screen.getByTestId("clerk-sign-up")).toHaveAttribute("data-redirect", "/onboarding"); expect(screen.getByText(/email or Google/i)).toBeInTheDocument(); });
  it("sends returning users to the dashboard", () => { render(<AuthScreen mode="sign-in" />); expect(screen.getByTestId("clerk-sign-in")).toHaveAttribute("data-redirect", "/dashboard"); });
});

describe("strategy inputs", () => {
  it("uses one project brief, an actual date input, and an exact budget control", () => {
    const { container } = render(<OneOffStrategyForm />);
    expect(screen.getByLabelText("Tell us what you’re working on")).toBeInTheDocument();
    expect(container.querySelectorAll("textarea")).toHaveLength(1);
    expect(screen.getByLabelText("Deadline")).toHaveAttribute("type", "date");
    fireEvent.click(screen.getByRole("button", { name: "Enter exact budget" }));
    expect(screen.getByLabelText("Exact budget")).toBeInTheDocument();
  });
  it("adds, edits, duplicates, and deletes monthly tasks with two sliders", () => {
    const { container } = render(<MonthlyTaskBuilder />);
    fireEvent.change(screen.getByLabelText("What do you regularly use AI for?"), { target: { value: "Research competitors" } });
    fireEvent.click(screen.getByRole("button", { name: /Add task/i }));
    expect(screen.getByDisplayValue("Research competitors")).toBeInTheDocument();
    expect(container.querySelectorAll('input[type="range"]')).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: /Duplicate Research competitors/i }));
    expect(screen.getByDisplayValue("Research competitors copy")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Delete Research competitors copy/i }));
    expect(screen.queryByDisplayValue("Research competitors copy")).not.toBeInTheDocument();
  });
  it("sends monthly tasks directly to AI stack results", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ strategyId: "monthly-id", result: { plans: [] } }), { status: 200 }));
    render(<MonthlyTaskBuilder />);
    fireEvent.change(screen.getByLabelText("What do you regularly use AI for?"), { target: { value: "Research competitors" } });
    fireEvent.click(screen.getByRole("button", { name: /Add task/i }));
    fireEvent.click(screen.getByRole("button", { name: "Find my monthly AI stack" }));
    await vi.waitFor(() => expect(routerPush).toHaveBeenCalledWith("/strategy/monthly-id/results"));
    expect(routerPush).not.toHaveBeenCalledWith(expect.stringContaining("/workflow"));
    expect(sessionStorage.getItem("benchflow:result:monthly-id")).toBe(JSON.stringify({ plans: [] }));
  });
  it("asks stakeholder-specific onboarding questions", () => {
    render(<OnboardingForm />);
    expect(screen.getByText("Profession")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Enterprise/ }));
    expect(screen.queryByText("Profession")).not.toBeInTheDocument();
    expect(screen.getByText("Company size")).toBeInTheDocument();
    expect(screen.getByText("Departments using AI")).toBeInTheDocument();
  });
});
