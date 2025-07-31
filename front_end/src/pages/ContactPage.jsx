import React from "react";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-color-1" />,
      title: "Email Us",
      details: "info@pritechvior.co.tz",
      description: "Send us an email for general inquiries"
    },
    {
      icon: <Phone className="w-6 h-6 text-color-1" />,
      title: "Call Us",
      details: "+255 627147681",
      description: "Speak directly with our team"
    },
    {
      icon: <MapPin className="w-6 h-6 text-color-1" />,
      title: "Visit Us",
      details: "Tanzania",
      description: "Meet us at our office location"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-color-1" />,
      title: "Live Chat",
      details: "Available 24/7",
      description: "Chat with our support team"
    }
  ];

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      {/* SEO Meta Tags */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact PRITECH VIOR",
          "description": "Get in touch with PRITECH VIOR for technology solutions, project inquiries, and partnership opportunities.",
          "url": "https://pritechvior.co.tz/contact",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://pritechvior.co.tz/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Contact",
                "item": "https://pritechvior.co.tz/contact"
              }
            ]
          }
        })}
      </script>
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="contact">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="Get In Touch"
            text="Ready to transform your ideas into reality? Contact us for consultations, project inquiries, or partnership opportunities"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-semibold text-n-1 mb-8">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-n-7 rounded-xl border border-n-6 hover:border-color-1 transition-all duration-300">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-n-1 mb-1">{item.title}</h4>
                      <p className="text-color-1 font-medium mb-1">{item.details}</p>
                      <p className="text-n-4 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-8 p-6 bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl border border-color-1/20">
                <h4 className="font-semibold text-n-1 mb-4">Business Hours</h4>
                <div className="space-y-2 text-n-3">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-n-8 rounded-2xl p-8 border border-n-6">
              <h3 className="text-2xl font-semibold text-n-1 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-n-3 text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-n-3 text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-n-3 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-n-3 text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-n-3 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                </div>

                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>

          {/* Map or Additional Info */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Whether you need a custom software solution, want to develop an e-learning platform, or require technical consultation, we're here to help bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="#schedule">Schedule a Call</Button>
                <Button className="bg-transparent border border-color-1 text-color-1 hover:bg-color-1 hover:text-white" href="#portfolio">
                  View Our Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default ContactPage;
