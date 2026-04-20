import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthField = {
  id: string;
  label: string;
  type?: string;
};

type AuthCardProps = {
  title: string;
  description: string;
  fields: AuthField[];
};

export function AuthCard({ title, description, fields }: AuthCardProps) {
  return (
    <div className="surface-card mx-auto max-w-xl p-6 sm:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-primary-hover">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <form className="space-y-5">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} type={field.type ?? "text"} />
          </div>
        ))}
        <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-1 size-4 rounded border-border" />
          <span>KVKK onay metnini okudum ve kabul ediyorum.</span>
        </label>
        <Button type="submit">Devam Et</Button>
      </form>
    </div>
  );
}
