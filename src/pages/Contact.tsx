import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card p-6 text-center">
            <Mail className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Email</h3>
            <a href="mailto:inquo4@gmail.com" className="text-muted-foreground hover:text-foreground">
              inquo4@gmail.com
            </a>
          </Card>

          <Card className="glass-card p-6 text-center">
            <Phone className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Phone</h3>
            <a href="tel:8002551361" className="text-muted-foreground hover:text-foreground">
              8002551361
            </a>
          </Card>

          <Card className="glass-card p-6 text-center">
            <MapPin className="w-8 h-8 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">
              Purnea, Bihar<br />India
            </p>
          </Card>
        </div>

        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">Support</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              For technical support, billing inquiries, or general questions, please reach out to us via email at{" "}
              <a href="mailto:inquo4@gmail.com" className="text-accent hover:underline">
                inquo4@gmail.com
              </a>
            </p>
            <p className="text-muted-foreground">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
