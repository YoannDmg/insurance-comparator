import { ComparisonProvider } from "@/context/comparison-context";
import { AppLayout } from "@/layouts/app-layout";

export function App() {
  return (
    <ComparisonProvider>
      <AppLayout />
    </ComparisonProvider>
  );
}

export default App;
