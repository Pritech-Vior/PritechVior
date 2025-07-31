import React from "react";
import Section from "./Section";
import { socials, navigation } from "../constants";
import { pritechviorLogo } from "../assets";

const Footer = () => {
  const quickLinks = navigation.filter(item => !item.onlyMobile);
  
  return (
    <Section crosses className="!px-0 !py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-color-1/10 to-color-2/10 border-2 border-color-1/30 hover:border-color-1/50 transition-all duration-300 flex items-center justify-center group">
                <img src={pritechviorLogo} width={28} height={28} alt="PritechVior" className="w-6 h-6 object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span className="text-lg font-bold text-n-1">PRITECH VIOR</span>
            </div>
            <p className="body-2 text-n-4 mb-6 max-w-md">
              Your trusted Tanzanian IT innovation partner. From project development to 
              e-learning platforms, we deliver complete technology solutions for modern businesses.
            </p>
            <div className="flex gap-4">
              {socials.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-full transition-colors hover:bg-n-6"
                >
                  <img src={item.iconUrl} width={16} height={16} alt={item.title} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="h6 text-n-1 mb-4">Quick Links</h6>
            <ul className="space-y-2">
              {quickLinks.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <a 
                    href={item.url} 
                    className="body-2 text-n-4 hover:text-n-1 transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h6 className="h6 text-n-1 mb-4">Platforms</h6>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="body-2 text-n-4 hover:text-n-1 transition-colors">
                  Tech Blog
                </a>
              </li>
              <li>
                <a href="/archive" className="body-2 text-n-4 hover:text-n-1 transition-colors">
                  Software Archive
                </a>
              </li>
              <li>
                <a href="/thinkforge" className="body-2 text-n-4 hover:text-n-1 transition-colors">
                  ThinkForge Learning
                </a>
              </li>
              <li>
                <a href="/viormart" className="body-2 text-n-4 hover:text-n-1 transition-colors">
                  ViorMart Store
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-n-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="caption text-n-4 text-center sm:text-left">
            © {new Date().getFullYear()} PritechVior. All rights reserved. | IT Innovation & Solutions - Tanzania
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-n-4 hover:text-n-1 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-n-4 hover:text-n-1 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Footer;
