import { ShoppingCart, Star, Package, ExternalLink, Filter, Search } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { products } from "../constants";
import { useState } from "react";

const ViorMartPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const categories = ["All", "Hardware", "Software", "Services", "Accessories", "Books"];
  const brands = ["All", "Dell", "HP", "Microsoft", "Adobe", "Logitech", "PritechVior"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });
  const ProductCard = ({ product }) => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-n-1 mb-2">{product.title}</h3>
          <p className="text-n-3 text-sm mb-3">{product.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-xs">
              {product.category}
            </span>
            <span className="px-3 py-1 bg-n-6 text-n-2 rounded-full text-xs">
              {product.brand}
            </span>
            {product.isAffiliate && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                Affiliate
              </span>
            )}
          </div>
        </div>
        {product.featured && (
          <div className="bg-color-2 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-color-1">{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-n-4 line-through">{product.originalPrice}</span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-n-1">{product.rating}</span>
            <span className="text-n-4">({product.reviews} reviews)</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="flex-1" href={`#product-${product.id}`} disabled={!product.inStock}>
          <ShoppingCart size={16} className="mr-2" />
          {product.inStock ? 'Add to Cart' : 'Notify Me'}
        </Button>
        {product.isAffiliate && (
          <Button className="px-3 border border-n-4 text-n-1 hover:bg-n-6" href={product.affiliateSource}>
            <ExternalLink size={16} />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="viormart">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="ViorMart"
            text="Your one-stop shop for premium tech products, development services, and digital solutions. Quality products at competitive prices."
          />

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
                <input
                  type="text"
                  placeholder="Search products by name, description, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter size={20} className="text-n-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none transition-colors"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center text-n-3">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {selectedBrand !== "All" && ` from ${selectedBrand}`}
            </div>
          </div>

          {/* Featured Products */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-n-1 mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProducts.filter(product => product.featured).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* All Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-n-1">All Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto text-n-4 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-2">No products found</h3>
                <p className="text-n-3">Try adjusting your search terms, category, or brand filter.</p>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-n-1 mb-6 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Laptops', 'Services', 'Accessories', 'Software'].map((category, index) => (
                <div key={index} className="bg-n-7 rounded-lg p-4 text-center border border-n-6 hover:border-color-1 transition-colors cursor-pointer">
                  <Package size={32} className="text-color-1 mx-auto mb-2" />
                  <h3 className="text-n-1 font-medium">{category}</h3>
                  <p className="text-n-4 text-sm">
                    {products.filter(product => product.category === category).length} items
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Services Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-n-1 mb-6 text-center">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
                <Package size={32} className="text-color-1 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-3">Custom Development</h3>
                <p className="text-n-3 text-sm mb-4">
                  Tailored software solutions for your business needs.
                </p>
                <ul className="text-n-4 text-sm space-y-1 mb-4">
                  <li>• Web Applications</li>
                  <li>• Mobile Apps</li>
                  <li>• Enterprise Systems</li>
                  <li>• API Integration</li>
                </ul>
                <Button className="w-full">Get Quote</Button>
              </div>

              <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
                <ShoppingCart size={32} className="text-color-1 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-3">E-commerce Solutions</h3>
                <p className="text-n-3 text-sm mb-4">
                  Complete online store setup with payment integration.
                </p>
                <ul className="text-n-4 text-sm space-y-1 mb-4">
                  <li>• Online Store Setup</li>
                  <li>• Payment Gateway</li>
                  <li>• Inventory Management</li>
                  <li>• Analytics Dashboard</li>
                </ul>
                <Button className="w-full">Learn More</Button>
              </div>

              <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
                <Star size={32} className="text-color-1 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-3">Consultation</h3>
                <p className="text-n-3 text-sm mb-4">
                  Expert advice for your digital transformation journey.
                </p>
                <ul className="text-n-4 text-sm space-y-1 mb-4">
                  <li>• Technical Architecture</li>
                  <li>• Technology Stack</li>
                  <li>• Project Planning</li>
                  <li>• Performance Optimization</li>
                </ul>
                <Button className="w-full">Book Session</Button>
              </div>
            </div>
          </div>

          {/* Contact for Custom Orders */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Need Something Custom?
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Looking for specific products or services not listed here? Contact us for custom solutions tailored to your needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="#contact">Request Custom Solution</Button>
                <Button className="border border-n-4 text-n-1 hover:bg-n-7" href="#catalog">
                  Download Catalog
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

export default ViorMartPage;
