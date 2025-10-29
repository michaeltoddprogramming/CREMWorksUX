import { Card, CardContent } from "@/components/ui/card";
import { Fish, Heart, Target } from "lucide-react";
import shopOwnersImage from "@/assets/shop-owners.jpg";

const About = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">About CREMFish</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four mates united by their passion for South African waters and quality fishing gear
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6">Meet the Founders</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Founded in 2018 by four lifelong friends - Cobus, Ruan, Euan, and Michael - 
              CREMFish started as a weekend passion project between fishing trips to the 
              KwaZulu-Natal coast and the Vaal Dam.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              What began as sharing gear recommendations in our WhatsApp group has grown 
              into South Africa's trusted online fishing tackle store. From surf fishing 
              at Sodwana Bay to bass angling in the Drakensberg, these four mates have 
              tested every piece of gear they sell.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, CREMFish serves anglers across South Africa with quality tackle, 
              competitive prices, and advice from people who genuinely live and 
              breathe fishing in our beautiful country.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={shopOwnersImage}
              alt="Cobus, Ruan, Euan, and Michael - CREMFish founders"
              className="rounded-lg shadow-[var(--shadow-medium)] w-full"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Fish className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Passion for Fishing</h3>
                <p className="text-muted-foreground">
                  We're anglers first, retailers second. Every product we carry is 
                  something we'd use ourselves on the water.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Customer Care</h3>
                <p className="text-muted-foreground">
                  Your success is our success. We're committed to helping you find 
                  exactly what you need for your fishing adventures.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Quality Focus</h3>
                <p className="text-muted-foreground">
                  We only stock gear that meets our high standards. If it's not good 
                  enough for us, it's not good enough for you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-muted/30 border-2">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                It all started on a weekend trip to Sodwana Bay in 2018. Cobus, Ruan, 
                Euan, and Michael - four lifelong mates - were frustrated with the 
                limited selection and overpriced gear at local tackle shops across 
                South Africa.
              </p>
              <p>
                What began as sharing gear recommendations in their WhatsApp group 
                evolved into something bigger. After successful fishing trips from the 
                KwaZulu-Natal coast to the Vaal Dam, they realized they'd tested and 
                reviewed more tackle than most shops even stocked.
              </p>
              <p>
                Word spread through the local angling community. Fellow fishermen 
                appreciated their honest reviews, quality recommendations, and the fact 
                that these guys actually used every piece of gear they suggested. By 
                2019, they'd launched CREMFish to serve anglers across South Africa.
              </p>
              <p>
                Today, while our reach has grown nationwide, our philosophy remains 
                unchanged: treat every customer like a fishing mate, stock only gear 
                we'd use ourselves, and always price fairly in Rand for South African 
                anglers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
