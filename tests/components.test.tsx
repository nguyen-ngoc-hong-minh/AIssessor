import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntegrationNotice } from "@/components/integration-notice";
import { AuthScreen } from "@/components/auth-screen";

describe("IntegrationNotice", () => {
  it("makes missing production configuration explicit", () => {
    render(<IntegrationNotice />);
    expect(screen.getByText(/live data services are not configured/i)).toBeInTheDocument();
    expect(screen.getByText(/fails closed instead of showing fake/i)).toBeInTheDocument();
  });
});

describe("AuthScreen", () => {
  it("offers the hosted ChatGPT sign-in", () => {
    render(<AuthScreen mode="sign-up" />);
    const link = screen.getByRole("link", { name: /continue with chatgpt/i });
    expect(link).toHaveAttribute("href", "/signin-with-chatgpt?return_to=%2Fonboarding");
    expect(screen.queryByText(/live services are not configured/i)).not.toBeInTheDocument();
  });
});
