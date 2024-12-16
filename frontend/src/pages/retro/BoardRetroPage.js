import "./styles.css";
import { getQuotes } from "./data";
import QuoteApp from "./QuoteApp";

const quoteMap = {
  alpha: getQuotes(7),
  beta: getQuotes(7)
};

export default function App() {
  return (
    <div className="App">
      <QuoteApp initial={quoteMap} isCombineEnabled />
    </div>
  );
}