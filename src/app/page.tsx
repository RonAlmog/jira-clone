import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 w-40 p-2">
      <Button variant="primary" size="lg">
        Primary
      </Button>
      <Button variant="secondary" size="sm">
        Secondary
      </Button>
      <Button variant="destructive">destructive</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="outline">outline</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="teritary">teritary</Button>
      <Input />
    </div>
  );
}
