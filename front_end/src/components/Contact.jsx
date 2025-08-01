import React from "react";
import Section from "./Section";
import Heading from "./Heading";
import Button from "./Button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send
} from "lucide-react";

const Contact = () => {
  return (
    <Section id="contact">
      <div className="container">
        <Heading
          className="md:max-w-3xl lg:max-w-4xl mx-auto text-center"
          title="Get In Touch"
          text="Ready to transform your business with innovative IT solutions? Let's discuss your project."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h4 className="h4 mb-6 text-n-1">Contact Information</h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-n-6 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-color-1" />
                  </div>
                  <div>
                    <h6 className="h6 text-n-1 mb-1">Address</h6>
                    <p className="body-2 text-n-4">
                      Mbeya, Tanzania<br />
                      Southern Highlands Technology Hub
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-n-6 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-color-1" />
                  </div>
                  <div>
                    <h6 className="h6 text-n-1 mb-1">Phone</h6>
                    <p className="body-2 text-n-4">+255 627147681</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-n-6 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-color-1" />
                  </div>
                  <div>
                    <h6 className="h6 text-n-1 mb-1">Email</h6>
                    <p className="body-2 text-n-4">info@pritechvior.co.tz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-n-6 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-color-1" />
                  </div>
                  <div>
                    <h6 className="h6 text-n-1 mb-1">Working Hours</h6>
                    <p className="body-2 text-n-4">
                      Mon - Fri: 8:00 AM - 6:00 PM<br />
                      Sat: 9:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-n-7 rounded-3xl p-8">
            <h4 className="h4 mb-6 text-n-1">Send us a Message</h4>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-n-3 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-xl text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-n-3 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-xl text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-n-3 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-xl text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-n-3 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-xl text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project requirements..."
                ></textarea>
              </div>

              <Button className="w-full flex items-center justify-center gap-2" white>
                <Send size={16} />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
