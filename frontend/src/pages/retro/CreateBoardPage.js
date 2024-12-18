import "./styles.css";
import {retrospectiveData} from "./data";
import BoardPage from "./BoardPage";


export default function App() {
  return (
    <div className="App">
      <BoardPage initial={retrospectiveData} isCombineEnabled />
    </div>
  );
}