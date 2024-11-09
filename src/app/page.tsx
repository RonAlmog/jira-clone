import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex gap-4">
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
    </div>
  );
}
