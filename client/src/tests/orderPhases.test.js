import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();

  const { unmount } = render(<App />);

  const vanillaInput = await screen.findByRole("spinbutton", { name: "Vanilla" });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2");

  const cherriesTopping = await screen.findByRole("checkbox", { name: "Cherries" });
  await user.click(cherriesTopping);

  const summaryOrderButton = screen.getByRole("button", { name: /order sundae/i });
  await user.click(summaryOrderButton);

  const orderSummaryHeading = screen.getByRole("heading", { name: /order summary/i });
  expect(orderSummaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: 'Scoops: $4.00' });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", { name: 'Toppings: $1.50' });
  expect(toppingsHeading).toBeInTheDocument();

  expect(screen.getByText("2 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  const tcCheckbox = screen.getByRole("checkbox", { name: /terms and conditions/i });
  await user.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole("button", { name: /confirm order/i });
  await user.click(confirmOrderButton);

  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();
  
  const thankYou = await screen.findByRole("heading", { name: "Thank you!" });
  expect(thankYou).toBeInTheDocument();

  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();

  const orderNumberHeading = await screen.findByText(/order number/i);
  expect(orderNumberHeading).toBeInTheDocument();

  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  await user.click(newOrderButton);

  const scoopTotals = screen.getByText("Scoops total: $0.00");
  expect(scoopTotals).toBeInTheDocument();
  const toppingsTotals = screen.getByText("Toppings total: $0.00");
  expect(toppingsTotals).toBeInTheDocument();

  unmount();
});

test('Toppings header is not on summary page if no toppings ordered', async () => {
  const user = userEvent.setup();

  const { unmount } = render(<App />);

  const vanillaInput = await screen.findByRole('spinbutton', { name: "Vanilla" });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');

  const chocolateInput = screen.getByRole('spinbutton', { name: "Chocolate" });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');

  const orderSummaryButton = screen.getByRole('button', { name: /order sundae/i });
  await user.click(orderSummaryButton);

  const scoopsSummary = screen.getByText('Scoops: $6.00');
  expect(scoopsSummary).toBeInTheDocument();
  
  const toppingsSummary = screen.queryByRole('heading', { name: /toppings/i });
  expect(toppingsSummary).not.toBeInTheDocument();

  unmount();
})
