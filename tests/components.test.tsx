import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthScreen } from "@/components/auth-screen";
import { AppShell } from "@/components/app-shell";
import { IntegrationNotice } from "@/components/integration-notice";
import { MonthlyTaskBuilder } from "@/components/monthly-task-builder";
import { OneOffStrategyForm } from "@/components/one-off-strategy-form";
import { OnboardingForm } from "@/components/onboarding-form";
import { ResultsView } from "@/components/results-view";
import { TrialResults } from "@/components/trial-results";
import type { StrategyPlan } from "@/lib/recommendation/types";

const { routerPush } = vi.hoisted(() => ({ routerPush: vi.fn() }));

vi.mock("@/components/providers", () => ({ authConfigured: true, integrationsConfigured: true }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: routerPush, replace: vi.fn() }), usePathname: () => "/" }));
vi.mock("@clerk/react", () => ({
  SignIn: (props: { fallbackRedirectUrl?: string }) => <div data-testid="clerk-sign-in" data-redirect={props.fallbackRedirectUrl} />,
  SignUp: (props: { forceRedirectUrl?: string }) => <div data-testid="clerk-sign-up" data-redirect={props.forceRedirectUrl} />,
  UserProfile: () => <div data-testid="clerk-user-profile" />,
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({ user: null }),
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
  it("sends new accounts to dashboard", () => { render(<AuthScreen mode="sign-up" />); expect(screen.getByTestId("clerk-sign-up")).toHaveAttribute("data-redirect", "/dashboard"); expect(screen.getByText(/email or Google/i)).toBeInTheDocument(); });
  it("sends returning users to the dashboard", () => { render(<AuthScreen mode="sign-in" />); expect(screen.getByTestId("clerk-sign-in")).toHaveAttribute("data-redirect", "/dashboard"); });
});

describe("strategy inputs", () => {
  it("routes New strategy to the usage chooser", () => {
    render(<AppShell user={{ name: "Test User", email: "test@example.com" }}><div>Content</div></AppShell>);
    expect(screen.getByText("New Strategy Builder")).toBeInTheDocument();
  });
  it("uses one project brief, an actual date input, and an exact budget control", () => {
    const { container } = render(<OneOffStrategyForm />);
    expect(screen.getByLabelText("Tell us what you’re working on")).toBeInTheDocument();
    expect(container.querySelectorAll("textarea")).toHaveLength(1);
    expect(screen.getByLabelText("Deadline")).toHaveAttribute("type", "date");
    fireEvent.click(screen.getByRole("button", { name: "Enter exact budget" }));
    expect(screen.getByLabelText("Exact budget")).toBeInTheDocument();
  });
  it("shows saved-plan confirmation and workflow editing at the end of results", async () => {
    const result = { locked: false, usageType: "one_off", plans: [{ variant: "recommended", steps: [], fixedCostUsd: 0, apiCostUsd: 0, totalCostUsd: 0, estimatedSavingsUsd: 0, existingSubscriptions: { kept: [], couldCancel: [] }, subscriptions: [], uniqueProductCount: 0, completeStepCount: 0, budgetUsd: null, budgetRemainingUsd: null, inputsUsed: { budgetOriginalCurrency: "USD", budgetOriginalAmount: null }, assumptions: [], dataUpdatedAt: Date.now() }], dataSnapshot: { fetchedAt: Date.now(), sources: [] } };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(result), { status: 200 }));
    render(<ResultsView strategyId="saved-strategy" />);
    expect(await screen.findByText("This model-by-model plan is in your history.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your workflow, model by model." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit workflow" })).toHaveAttribute("href", "/strategy/saved-strategy/workflow");
  });
  it("shows project costs and the exact remaining balance in the selected VND currency", async () => {
    const result = { locked: false, usageType: "one_off", plans: [{ variant: "recommended", steps: [], fixedCostUsd: 0, apiCostUsd: 0.54, totalCostUsd: 0.54, estimatedSavingsUsd: 0, existingSubscriptions: { kept: [], couldCancel: [] }, subscriptions: [], uniqueProductCount: 0, completeStepCount: 0, budgetUsd: 1139.998898, budgetRemainingUsd: 1139.458898, inputsUsed: { projectDescription: "Project", expectedResult: "Result", budgetUsd: 1139.998898, budgetOriginalAmount: 29_999_971, budgetOriginalCurrency: "VND", deadline: null, priorityRanking: ["balanced"], existingTools: [], informationSensitivity: "standard", commercialUse: false, providersToAvoid: [], preferredLanguage: "Vietnamese", expectedOutputs: null, region: "global" }, assumptions: [], dataUpdatedAt: Date.now() }], dataSnapshot: { fetchedAt: Date.now(), sources: [] } };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(result), { status: 200 }));
    render(<ResultsView strategyId="vnd-strategy" />);
    expect(await screen.findByText(/29\.999\.971/)).toBeInTheDocument();
    expect(screen.getAllByText(/14\.211/).length).toBeGreaterThan(0);
    expect(screen.getByText(/29\.985\.760/)).toBeInTheDocument();
    expect(screen.getByText(/Shown in VND/i)).toBeInTheDocument();
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
    expect(screen.getByText("Rank your priorities")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move Balanced down" })).toBeInTheDocument();
    expect(screen.getByLabelText("Tools already owned")).toBeInTheDocument();
    expect(screen.getByLabelText("Expected output details")).toBeInTheDocument();
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

describe("anonymous trial results", () => {
  it("keeps a partial recommendation honest and withholds unsafe cancellation advice", () => {
    const plan = {
      variant: "recommended",
      steps: [
        {
          stepId: "research", taskCategory: "research", step: { name: "Research", plainLanguageDescription: "Find current sources", noAIEligible: false, noAIAlternative: "Research manually" }, partialOptions: [],
          selected: { explanation: ["It fits the research task."], tools: [{ model: { id: "sonar", name: "Sonar", provider: "Perplexity" }, access: { productName: "OpenRouter", accessMethod: "marketplace", url: "https://example.com" }, coversCapabilities: ["web_research"], estimatedCostUsd: 0.54 }] },
        },
        { stepId: "visuals", taskCategory: "image_generation", step: { name: "Visuals", plainLanguageDescription: "Generate campaign images", noAIEligible: false, noAIAlternative: "Design manually" }, selected: null, partialOptions: [] },
      ],
      fixedCostUsd: 0,
      apiCostUsd: 0.54,
      totalCostUsd: 0.54,
      estimatedSavingsUsd: 0,
      budgetRemainingUsd: 4.46,
      completeStepCount: 1,
      existingSubscriptions: { kept: [], couldCancel: ["ChatGPT"] },
      subscriptions: [{
        productId: "perplexity", productName: "Perplexity", planName: "API access", modelNames: ["Sonar"], stepIds: ["research"], stepNames: ["Research"],
        alreadyOwned: false, accessMethod: "marketplace", accessUrl: "https://example.com", priceUsd: null, apiUsageEstimateUsd: 0.54,
      }],
      inputsUsed: { budgetOriginalCurrency: "USD" },
      assumptions: [],
      dataUpdatedAt: Date.now(),
    } as unknown as StrategyPlan;

    render(<TrialResults result={{ usageType: "one_off", plans: [plan] }} saveControl={<button>Save my AI stack</button>} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/1 of 2 jobs matched/i);
    expect(screen.getByRole("heading", { name: "Sonar" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "OpenRouter" })).not.toBeInTheDocument();
    expect(screen.getByText("USE")).toBeInTheDocument();
    expect(screen.queryByText("KEEP")).not.toBeInTheDocument();
    expect(screen.getByText("No cancellation advice yet.")).toBeInTheDocument();
    expect(screen.queryByText("CANCEL")).not.toBeInTheDocument();
    expect(screen.getByText("No cap")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save my AI stack" })).toBeInTheDocument();
  });
});
