// sample news articles (mock data)
const newsArticles = [
  {
    title: "AI Revolution in Healthcare",
    content: "Artificial intelligence is transforming healthcare by enabling faster diagnosis, personalized treatment plans, and improved patient outcomes. Hospitals worldwide are adopting AI-powered diagnostic tools for imaging, triage, and remote monitoring. These systems help doctors detect diseases earlier, reduce errors, and optimize resource allocation. Ethical guidelines and data privacy regulations are evolving to keep pace with this rapid change.",
    source: "TechNews Daily"
  },
  {
    title: "Global Climate Summit 2024",
    content: "World leaders gathered to discuss climate change mitigation strategies and long-term adaptation plans. New renewable energy targets were set for 2030, focusing on wind, solar, and grid-scale storage. Several countries pledged to phase out coal and invest heavily in green hydrogen. Activists emphasized climate justice and support for vulnerable nations facing rising sea levels and extreme weather.",
    source: "EcoNews"
  },
  {
    title: "Quantum Computing Breakthroughs",
    content: "Scientists announced a major breakthrough in quantum computing, achieving quantum supremacy on a broader class of real-world problems. The new system demonstrates practical applications in cryptography, optimization, and drug discovery. Researchers developed improved error-correction techniques, making quantum processors more stable. Tech companies are now racing to commercialize quantum cloud services for enterprises.",
    source: "Science Weekly"
  },
  {
    title: "Stock Market Reaches New Heights",
    content: "Global stock markets surged to record highs as investors showed renewed confidence in technology and renewable energy sectors. Analysts attribute the rally to strong earnings, easing inflation concerns, and continued central bank support. Some experts warn of overvaluation risks, especially in speculative growth stocks. Long-term investors are diversifying into dividend-paying companies and infrastructure assets.",
    source: "Finance Today"
  },
  {
    title: "Space Exploration Milestones",
    content: "NASA successfully launched the latest Mars rover, equipped with advanced AI and autonomous navigation capabilities. The mission aims to search for signs of ancient microbial life and prepare for future human exploration. Private space companies are also expanding their launch schedules for satellite deployment and lunar missions. International collaboration remains crucial for deep-space research and planetary defense.",
    source: "Space News"
  },

  {
    title: "5G Networks Transform Smart Cities",
    content: "Telecom operators are rolling out dense 5G networks that enable ultra-low-latency communication in urban areas. Smart traffic lights, connected public transport, and real-time pollution monitoring systems are now being deployed at scale. City planners are using high-resolution data to optimize energy usage and reduce congestion. Privacy advocates are calling for transparent governance of sensor data and surveillance infrastructure.",
    source: "UrbanTech Journal"
  },
  {
    title: "Breakthrough in Renewable Energy Storage",
    content: "Researchers have developed a new battery chemistry that dramatically improves energy density and cycle life. The technology could make large-scale storage for solar and wind power far more economical. Pilot projects are underway to integrate these batteries into existing grids and microgrid systems. Policymakers see this as a key enabler for achieving net-zero emissions targets.",
    source: "Energy Focus"
  },
  {
    title: "E-Sports Industry Surpasses Traditional Leagues",
    content: "The global e-sports industry has surpassed several traditional sports leagues in annual viewership and sponsorship revenue. Major tournaments now fill stadiums and draw millions of online spectators. Teams are investing in professional training facilities, sports psychologists, and analytics departments. Brands see e-sports as a highly effective way to reach younger, digital-native audiences.",
    source: "Digital Sports Review"
  },
  {
    title: "Advances in Personalized Education Platforms",
    content: "EdTech companies are launching adaptive learning platforms that tailor lessons to each student’s pace and style. AI algorithms analyze performance data to recommend exercises, videos, and interactive simulations. Teachers gain dashboards that highlight struggling students and common misconceptions. Schools are experimenting with blended models that combine in-person instruction with data-driven digital content.",
    source: "Education Today"
  },
  {
    title: "Autonomous Vehicles Enter Commercial Logistics",
    content: "Several logistics firms have begun pilot programs using autonomous trucks on fixed highway routes. Early results show reduced fuel consumption and more consistent delivery times. Regulators are closely monitoring safety metrics and requiring redundant remote supervision systems. Labor organizations are negotiating retraining programs for drivers affected by automation.",
    source: "Transport & Mobility News"
  },
  {
    title: "Breakthrough Gene Therapy Approved",
    content: "Regulators have approved a new gene therapy for a rare inherited blood disorder after promising clinical trial results. The treatment modifies patients’ own cells to correct the underlying genetic defect. Although the therapy is expensive, health economists argue that it may reduce lifelong care costs and hospitalizations. Patient advocacy groups are celebrating the decision while calling for broader access programs.",
    source: "Medical Frontiers"
  },
  {
    title: "Global Cybersecurity Threat Landscape Evolves",
    content: "Security researchers report a sharp increase in supply-chain attacks and ransomware targeting critical infrastructure. Nation-state actors and organized crime groups are exploiting software vulnerabilities at unprecedented speed. Companies are adopting zero-trust architectures, continuous monitoring, and mandatory security training. Governments are updating cybercrime laws and encouraging public–private information sharing.",
    source: "Cyber Defense Weekly"
  },
  {
    title: "Rise of Sustainable Fashion Brands",
    content: "A growing number of fashion brands are adopting circular economy principles, using recycled fabrics and designing for durability. Consumers are increasingly demanding transparency about supply chains and environmental impacts. Second-hand marketplaces and clothing rental services are expanding quickly in major cities. Industry analysts expect sustainability metrics to become as important as price and style in purchasing decisions.",
    source: "Style & Sustainability"
  },
  {
    title: "Virtual Reality Redefines Remote Collaboration",
    content: "Tech companies are releasing new VR headsets and collaboration platforms aimed at remote teams. Virtual offices and meeting rooms allow participants to interact with 3D models, whiteboards, and shared workspaces. Early adopters report improved engagement for design reviews, training, and brainstorming sessions. Challenges remain around comfort, motion sickness, and hardware accessibility.",
    source: "Future of Work Report"
  },
  {
    title: "Agricultural Robotics Boost Farm Productivity",
    content: "Autonomous tractors, drones, and harvesting robots are being deployed on large farms to handle repetitive tasks. These systems use computer vision and sensors to navigate fields, identify crop health issues, and apply fertilizers precisely. Farmers report reduced labor costs and more efficient use of water and chemicals. Startups are now targeting smaller farms with modular, lower-cost robotic solutions.",
    source: "AgriTech Insights"
  },
  {
    title: "Global Tourism Rebounds with Digital Passports",
    content: "Tourism is rebounding as countries adopt digital health passports and streamlined visa processes. Airlines and hotels are using AI to forecast demand and optimize pricing. Many destinations are promoting sustainable tourism practices to protect local ecosystems and communities. Travelers are favoring longer stays and remote work–friendly locations.",
    source: "World Travel Monitor"
  },
  {
    title: "FinTech Startups Disrupt Traditional Banking",
    content: "New FinTech startups are offering mobile-first banking services with low fees and instant account opening. Features like real-time spending analytics, automated savings, and crypto integration are attracting younger customers. Traditional banks are responding with partnerships, acquisitions, and their own digital-only brands. Regulators are updating frameworks to balance innovation with consumer protection.",
    source: "FinTech Journal"
  },
  {
    title: "Smart Home Devices Gain Interoperability",
    content: "The adoption of a new open standard has made it easier for smart home devices from different brands to work together. Users can now control lighting, climate, security, and entertainment systems through a single app or voice assistant. Manufacturers benefit from reduced integration complexity and a larger compatible ecosystem. Privacy and security remain key concerns as more household data moves to the cloud.",
    source: "Connected Home News"
  },
  {
    title: "Biodegradable Plastics Enter Mass Production",
    content: "Chemical companies have scaled up production of biodegradable plastics derived from plant-based feedstocks. These materials are designed to break down more quickly in industrial composting facilities than conventional plastics. Retailers are starting to adopt biodegradable packaging for everyday products. Environmental groups welcome the shift but stress that waste reduction and recycling remain essential.",
    source: "Green Materials Review"
  },
  {
    title: "Advanced Analytics Transform Sports Strategy",
    content: "Professional sports teams are investing heavily in data science departments to gain competitive advantages. Player tracking data, biometric sensors, and video analysis are used to refine tactics and manage workloads. Coaches receive real-time insights on player positioning and performance during games. Fans also benefit from deeper statistics and interactive viewing experiences.",
    source: "Pro Sports Analytics"
  },
  {
    title: "New Privacy Regulations Impact Online Advertising",
    content: "Several regions have introduced stricter privacy laws that limit the use of third-party cookies and tracking technologies. Advertisers are shifting toward contextual targeting and first-party data strategies. Publishers are investing in consent management tools and transparent data policies. Industry experts expect a gradual move away from invasive tracking toward more privacy-friendly business models.",
    source: "AdTech Review"
  },
  {
    title: "3D Printing Moves Into Large-Scale Construction",
    content: "Construction companies are experimenting with 3D-printed concrete structures for houses, bridges, and public infrastructure. The approach can reduce material waste and shorten project timelines significantly. Engineers are developing new printable materials with better strength and insulation properties. Building codes are slowly adapting to accommodate these novel techniques.",
    source: "Construction Innovation Daily"
  },
  {
    title: "Advances in Battery Recycling Technologies",
    content: "New recycling plants are using advanced hydrometallurgical processes to recover lithium, cobalt, and nickel from used batteries. This helps reduce dependency on mining and lowers the environmental footprint of electric vehicles. Automakers are signing long-term contracts with recyclers to secure secondary raw materials. Policymakers are considering incentives and regulations to increase collection rates.",
    source: "Circular Economy News"
  },
  {
    title: "Mental Health Apps Gain Clinical Validation",
    content: "Several mental health apps have completed rigorous clinical trials and demonstrated effectiveness for conditions like anxiety and mild depression. Healthcare providers are beginning to prescribe these digital therapeutics alongside traditional treatments. The apps offer guided exercises, mood tracking, and access to remote therapists. Experts highlight the importance of strong data protection and clear clinical guidelines.",
    source: "HealthTech Review"
  },
  {
    title: "Cultural Heritage Preservation Goes Digital",
    content: "Museums and archives are using high-resolution 3D scanning and VR to preserve and showcase cultural artifacts. Visitors can explore virtual exhibitions that recreate historical sites and objects in great detail. Digitization also protects fragile items from physical wear while making them accessible to global audiences. Collaborative projects are helping smaller institutions share their collections online.",
    source: "Global Culture Report"
  }
];


// different cateegory articles
const categories = [
  "Technology", "Business", "Science", "Health", "Environment", 
  "Politics", "Sports", "Entertainment", "Travel", "Education"
];

const verbs = ["launches", "introduces", "announces", "reveals", "discovers"];
const objects = ["breakthrough", "solution", "innovation", "discovery", "development"];

for (let i = 5; i < 50; i++) {
  const category = categories[i % categories.length];
  const verb = verbs[i % verbs.length];
  const obj = objects[i % objects.length];
  
  newsArticles.push({
    title: `${category}: New ${obj} ${verb}`,
    content: `This is article ${i}. ${category} sector experiences significant growth with new ${obj} in ${category.toLowerCase()}. Experts believe this will change the industry...`,
    source: `${category} News`
  });
}

module.exports = newsArticles;
