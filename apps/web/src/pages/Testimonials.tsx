import { PageLayout, useHub } from "@sms-hub/ui";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { getHubColorClasses } from "@sms-hub/utils";
import { Star, Quote, Users, Building, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react";

const Testimonials = () => {
  const { currentHub, hubConfig } = useHub();
  const hubColors = getHubColorClasses(currentHub);

  const testimonials = [
    {
      name: "Marcus Rodriguez",
      role: "Owner",
      company: "The Velvet Lounge",
      location: "Miami, FL",
      rating: 5,
      content: "Gnymble transformed how we communicate with our VIP clients. The compliance features give us peace of mind, and our customers love the seamless experience. It's like having a personal concierge for every guest.",
      avatar: "MR",
      industry: "Premium Nightclub"
    },
    {
      name: "Sarah Chen",
      role: "General Manager",
      company: "Azure Wine & Cigar",
      location: "San Francisco, CA",
      rating: 5,
      content: "As a high-end establishment, we needed a platform that understood our regulatory requirements. Gnymble not only meets those needs but exceeds them. Our customer engagement has increased by 40%.",
      avatar: "SC",
      industry: "Luxury Wine Bar"
    },
    {
      name: "David Thompson",
      role: "Operations Director",
      company: "The Gentleman's Club",
      location: "New York, NY",
      rating: 5,
      content: "The automated campaigns are a game-changer. We can now personalize our VIP communications at scale while maintaining the sophisticated touch our members expect. Gnymble gets premium venues.",
      avatar: "DT",
      industry: "Private Members Club"
    },
    {
      name: "Isabella Martinez",
      role: "Marketing Manager",
      company: "Elite Cigar Society",
      location: "Los Angeles, CA",
      rating: 5,
      content: "Finally, a platform that speaks our language. The regulatory expertise built into Gnymble means we can focus on what we do best - creating exceptional experiences for our discerning clientele.",
      avatar: "IM",
      industry: "Premium Cigar Lounge"
    },
    {
      name: "James Wilson",
      role: "CEO",
      company: "The Speakeasy Group",
      location: "Chicago, IL",
      rating: 5,
      content: "Managing multiple premium venues requires sophisticated tools. Gnymble's multi-location support and compliance features have streamlined our operations across all properties.",
      avatar: "JW",
      industry: "Multi-Venue Hospitality"
    },
    {
      name: "Emily Foster",
      role: "Director of Guest Relations",
      company: "The Royal Oak",
      location: "Boston, MA",
      rating: 5,
      content: "Our guests appreciate the seamless communication, and our team loves the intuitive interface. Gnymble has elevated our service standards while maintaining our exclusive atmosphere.",
      avatar: "EF",
      industry: "Luxury Hotel Bar"
    }
  ];

  const stats = [
    {
      number: "98%",
      label: "Customer Satisfaction",
      icon: Star
    },
    {
      number: "40%",
      label: "Average Engagement Increase",
      icon: Zap
    },
    {
      number: "100%",
      label: "Regulatory Compliance",
      icon: Shield
    },
    {
      number: "500+",
      label: "Premium Venues Served",
      icon: Building
    }
  ];

  return (
    <PageLayout
      showNavigation={true}
      showFooter={true}
      navigation={<Navigation />}
      footer={<Footer />}
    >
      {/* Hero Section with proper top padding for fixed navigation */}
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Hero Content */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <span className={`text-sm font-medium ${hubColors.text}`}>
                Client Success Stories
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="block">Trusted by</span>
              <span className={`${hubColors.text} bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent`}>
                premium venues
              </span>
              <span className="block">worldwide</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover how sophisticated establishments are transforming their customer communication 
              with our premium SMS platform. Real results from real venues.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-orange-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {stat.number}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Hear directly from the venues that trust us with their most valuable asset - their customer relationships.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 hover:border-orange-500/30 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="w-8 h-8 text-orange-500/50" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-orange-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-full flex items-center justify-center mr-4">
                        <span className="text-orange-400 font-semibold text-sm">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                        <div className="text-xs text-gray-500">{testimonial.location}</div>
                      </div>
                    </div>
                    
                    {/* Industry Badge */}
                    <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                      <span className="text-xs text-orange-400 font-medium">
                        {testimonial.industry}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Metrics Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Proven Results
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Our platform delivers measurable improvements that premium venues can count on.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Increased Engagement</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Venues see an average 40% increase in customer engagement and response rates.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Regulatory Peace</h3>
                  <p className="text-gray-300 leading-relaxed">
                    100% compliance rate with built-in regulatory expertise and monitoring.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Customer Satisfaction</h3>
                  <p className="text-gray-300 leading-relaxed">
                    98% customer satisfaction rate with premium support and personalized service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to join our success stories?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                See how Gnymble can transform your venue's customer communication 
                and join the ranks of premium establishments that trust us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => window.location.href = '/solutions'}
                  className="px-8 py-4 border-2 border-orange-500/50 text-orange-400 font-semibold rounded-xl hover:bg-orange-500/10 hover:border-orange-400 transition-all duration-300"
                >
                  Explore Solutions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Testimonials;
