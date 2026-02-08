import { FileText } from "lucide-react";
import Layout from "@/components/Layout";

const Docs = () => {
  return (
    <Layout>
      <section className="py-20">
        <div className="container max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
            Documentation
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Documentation is coming soon. In the meantime, explore live markets or
            create your own opportunity market to get started.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Docs;
