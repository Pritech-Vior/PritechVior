import { Download, Star, Package, Shield, Monitor } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { archiveItems } from "../constants";

const ArchivePage = () => {
  const ArchiveCard = ({ item }) => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Package size={32} className="text-color-1" />
          <div>
            <h3 className="text-xl font-semibold text-n-1">{item.title}</h3>
            <p className="text-n-4 text-sm">v{item.version}</p>
          </div>
        </div>
        {item.featured && (
          <div className="bg-color-2 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <p className="text-n-3 text-sm mb-4">{item.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-xs">
          {item.category}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs ${
          item.license === 'Free' ? 'bg-green-500/20 text-green-400' :
          item.license === 'Freemium' ? 'bg-blue-500/20 text-blue-400' :
          'bg-yellow-500/20 text-yellow-400'
        }`}>
          {item.license}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-n-3">
          <Package size={16} />
          {item.size}
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Download size={16} />
          {item.downloadCount.toLocaleString()} downloads
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Star size={16} />
          {item.rating} rating
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Shield size={16} />
          Verified
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-n-1 font-medium mb-2">Platforms:</h4>
        <div className="flex flex-wrap gap-2">
          {item.platforms.map((platform, index) => (
            <span key={index} className="px-2 py-1 bg-n-6 text-n-2 rounded text-xs flex items-center gap-1">
              <Monitor size={12} />
              {platform}
            </span>
          ))}
        </div>
      </div>

      <Button className="w-full" href={`#download-${item.id}`}>
        <Download size={16} className="mr-2" />
        Download Now
      </Button>
    </div>
  );

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="archive">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="Software Archive"
            text="Download premium software, tools, and resources to boost your productivity and streamline your development workflow."
          />

          {/* Featured Software */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-n-1 mb-6">Featured Software</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {archiveItems.filter(item => item.featured).map((item) => (
                <ArchiveCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* All Software */}
          <div>
            <h2 className="text-2xl font-semibold text-n-1 mb-6">All Software</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveItems.map((item) => (
                <ArchiveCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-n-1 mb-6 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Productivity', 'Education', 'Finance', 'Development'].map((category, index) => (
                <div key={index} className="bg-n-7 rounded-lg p-4 text-center border border-n-6 hover:border-color-1 transition-colors cursor-pointer">
                  <Package size={32} className="text-color-1 mx-auto mb-2" />
                  <h3 className="text-n-1 font-medium">{category}</h3>
                  <p className="text-n-4 text-sm">
                    {archiveItems.filter(item => item.category === category).length} items
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Request */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Request Software
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Let us know what software or tools you need, and we'll add them to our archive.
              </p>
              <Button href="#contact">Request Software</Button>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default ArchivePage;
