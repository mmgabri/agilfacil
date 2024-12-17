import "./styles.css";
import { getQuotes } from "./data";
import {retrospectiveData} from "./data2";
import QuoteApp from "./QuoteApp";


export default function App() {
  return (
    <div className="App">
      <QuoteApp initial={retrospectiveData} isCombineEnabled />
    </div>
  );
}