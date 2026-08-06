import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntegrationNotice } from "@/components/integration-notice";

describe("IntegrationNotice", () => {
  it("makes missing production configuration explicit", () => {
    render(<IntegrationNotice />);
    expect(screen.getByText(/live services are not configured/i)).toBeInTheDocument();
    expect(screen.getByText(/fails closed instead of showing fake/i)).toBeInTheDocument();
  });
});
