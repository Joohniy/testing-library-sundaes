import {
  screen,
  render,
  waitFor,
} from "../../test-utils/testing-library-utils";
import { rest } from "msw";
import { server } from "../../mocks/server";
import OrderConfirmation from './OrderConfirmation';

test("display alert message on order confirmation page", async () => {
  server.resetHandlers(
    rest.post("http://localhost:3030/order", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderConfirmation />);

  await waitFor(async () => {
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('An unexpected error occurred. Please try again later.');
  })
});
