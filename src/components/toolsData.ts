export interface Category {
    logo: string;
    name: string;
    toolCount?: number;
    tagLine: string;
    redirectTo: string;
  }

  const categories : Category[]  = [
    {
      logo: "https://www.svgrepo.com/show/219380/tools-screwdriver.svg",
      name: "All Tools",
      toolCount: 130,
      tagLine: "Empower Your Productivity with Versatile Tools for Every Task",
      redirectTo: "/category/All Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/407090/person-pouting-light-skin-tone.svg",
      name: "My Tools",
      tagLine: "View and manage your bookmarked tools",
      redirectTo: "/category/My Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/343856/marketing-flow-business.svg",
      name: "Social Media Tools",
      toolCount: 36,
      tagLine: "Enhance Your Social Presence with Seamless Content Creation",
      redirectTo: "/category/Social Media Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/387435/edit.svg",
      name: "Content Generation Tools",
      toolCount: 13,
      tagLine: "Create Compelling Content with Ease",
      redirectTo: "/category/Content Generation Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/520509/video-courses.svg",
      name: "Video Tools",
      toolCount: 12,
      tagLine: "Transform Your Video Content with Powerful Tools",
      redirectTo: "/category/Video Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/375830/image.svg",
      name: "Image Generator & Image Tools",
      toolCount: 12,
      tagLine: "Streamline Your File Manangement and Image Editing",
      redirectTo: "/category/Image Generator & Image Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/490948/audio.svg",
      name: "Audio Tools",
      toolCount: 7,
      tagLine: "Unleash Your Creativity: Top Tools for Audio Mastery",
      redirectTo: "/category/Audio Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/242947/marketing-professions-and-jobs.svg",
      name: "Marketing Tools",
      toolCount: 8,
      tagLine: "Drive Your Campaigns with Innovative Marketing Tools",
      redirectTo: "/category/Marketing Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/261894/translator-subject.svg",
      name: "Language Translator Tools",
      toolCount: 1,
      tagLine: "Break Barriers: Seamless Language Translation Tools",
      redirectTo: "/category/Language Translator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/250184/qr-code.svg",
      name: "QR Code Generator Tools",
      toolCount: 1,
      tagLine: "Scan the Future: Create Custom QR Codes Instantly",
      redirectTo: "/category/QR Code Generator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/454713/article-blog-optimation.svg",
      name: "Article Generator Tools",
      toolCount: 4,
      tagLine: "Generate High-Quality Articles Instantly with Our Advanced Writing Tools",
      redirectTo: "/category/Article Generator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/343850/blog-seo-optimization-search.svg",
      name: "Blog Generator Tools",
      toolCount: 5,
      tagLine: "Create Engaging Blog Posts in Minutes with Our Powerful Generation Tools",
      redirectTo: "/category/Blog Generator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/271588/newspaper-journal.svg",
      name: "Press Release Tools",
      toolCount: 1,
      tagLine: "Craft Professional Press Releases Quickly with Our Comprehensive Tools",
      redirectTo: "/category/Press Release Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/268514/voice-recording-radio.svg",
      name: "Podcast Generator Tools",
      toolCount: 1,
      tagLine: "Transform Ideas into Captivating Podcasts with Our Easy-to-Use Generation Tools",
      redirectTo: "/category/Podcast Generator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/395625/news.svg",
      name: "NewsLetter Tools",
      toolCount: 1,
      tagLine: "Design and Deliver Impactful Newsletters Effortlessly with Our All-in-One Tools",
      redirectTo: "/category/NewsLetter Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/415749/email-inbox-letter.svg",
      name: "Email Generator Tools",
      toolCount: 11,
      tagLine: "Effortless Email Solutions for Every Business Need",
      redirectTo: "/category/Email Generator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/207030/startup-bussiness.svg",
      name: "Start-Up Tools",
      toolCount: 12,
      tagLine: "Empower Your Startup with Essential Tools for Success",
      redirectTo: "/category/Start-Up Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/485395/file.svg",
      name: "File Converter Tools",
      toolCount: 8,
      tagLine: "Seamlessly Convert Your Files with Our Versatile Conversion Tools",
      redirectTo: "/category/File Converter Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/475656/google-color.svg",
      name: "Google Adwords & Meta Ads",
      toolCount: 2,
      tagLine: "Maximize Your Reach with Our Powerful Google Ad Tools",
      redirectTo: "/category/Google Adwords & Meta Ads"
    },
    {
      logo: "https://www.svgrepo.com/show/299307/browser-seo-and-web.svg",
      name: "SEO Tools",
      toolCount: 2,
      tagLine: "Optimize Your Online Presence for Maximum Impact",
      redirectTo: "/category/SEO Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/349410/instagram.svg",
      name: "Instagram Tools",
      toolCount: 8,
      tagLine: "Elevate Your Instagram Presence with Our Essential Tools",
      redirectTo: "/category/Instagram Tools"
    },
    {
      logo: "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512d8dd24a0261059ca0b40_logo-threads.svg",
      name: "Instagram Threads Tools",
      toolCount: 1,
      tagLine: "Enhance Your Instagram Strategy with Our Comprehensive Tools",
      redirectTo: "/category/Instagram Threads Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/475647/facebook-color.svg",
      name: "Facebook Tools",
      toolCount: 8,
      tagLine: "Boost Your Facebook Strategy with Our Essential Tools",
      redirectTo: "/category/Facebook Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/475700/youtube-color.svg",
      name: "Youtube Tools",
      toolCount: 6,
      tagLine: "Elevate Your YouTube Presence with Our Comprehensive Tools",
      redirectTo: "/category/Youtube Tools"
    },
    {
      logo: "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512589c982265fa7120a132_ico-X.svg",
      name: "(X) Twitter Tools",
      toolCount: 4,
      tagLine: "Enhance Your Twitter Strategy with Our Powerful Tools",
      redirectTo: "/category/(X) Twitter Tools"
    },
    {
      logo: "https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512589c982265fa7120a132_ico-X.svg",
      name: "(X) Twitter Threads Tools",
      toolCount: 2,
      tagLine: "Master Your Twitter Threads with Our Advanced Tools",
      redirectTo: "/category/(X) Twitter Threads Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/303299/linkedin-icon-2-logo.svg",
      name: "Linkedin Tools",
      toolCount: 6,
      tagLine: "Optimize Your LinkedIn Presence with Our Comprehensive Tools",
      redirectTo: "/category/Linkedin Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/452114/tiktok.svg",
      name: "Tiktok Tools",
      toolCount: 2,
      tagLine: "Boost Your TikTok Success with Our Powerful Tools",
      redirectTo: "/category/Tiktok Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/292472/website-ui.svg",
      name: "Website Tools",
      toolCount: 4,
      tagLine: "Transform Your Online Presence with Our Essential Website Tools",
      redirectTo: "/category/Website Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/446529/avatar.svg",
      name: "Avatar Generator Tools",
      toolCount: 1,
      tagLine: "Craft Unique Avatars with Our Easy-to-Use Design Tools",
      redirectTo: "/category/Avatar Generator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/484943/pdf-file.svg",
      name: "PDF Tools",
      toolCount: 8,
      tagLine: "Manage and Edit Your PDFs Seamlessly with Our Versatile Tools",
      redirectTo: "/category/PDF Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/461636/hastag-square.svg",
      name: "Hashtag Generator Tools",
      toolCount: 1,
      tagLine: "Maximize Your Social Media Reach with Our Effective Hashtag Tools",
      redirectTo: "/category/Hashtag Generator Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/476957/document.svg",
      name: "Paraphase Tools",
      toolCount: 1,
      tagLine: "Refine Your Writing Instantly with Our Advanced Paraphrasing Tools",
      redirectTo: "/category/Paraphase Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/159920/detective.svg",
      name: "AI Detector Tools",
      toolCount: 1,
      tagLine: "Identify and Analyze with Precision Using Our AI Detector Tools",
      redirectTo: "/category/AI Detector Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/410916/research.svg",
      name: "Humanize AI Tools",
      toolCount: 1,
      tagLine: "Enhance Human Interactions with Advanced AI Tools",
      redirectTo: "/category/Humanize AI Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/439270/prettier.svg",
      name: "Prompt Tools",
      toolCount: 1,
      tagLine: "Inspire Creativity and Efficiency with Our Versatile Prompt Tools",
      redirectTo: "/category/Prompt Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/474372/code.svg",
      name: "Code Converter Tools",
      toolCount: 1,
      tagLine: "Effortlessly Transform Your Code with Our Advanced Conversion Tools",
      redirectTo: "/category/Code Converter Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/373590/excel2.svg",
      name: "Excel Sheet Tools",
      toolCount: 1,
      tagLine: "Streamline Your Data Management with Our Powerful Excel Tools",
      redirectTo: "/category/Excel Sheet Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/56741/jpg.svg",
      name: "JPG Tools",
      toolCount: 3,
      tagLine: "Optimize and Transform Your Images with Our Advanced JPG Tools",
      redirectTo: "/category/JPG Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/213365/png.svg",
      name: "PNG Tools",
      toolCount: 3,
      tagLine: "Edit and Enhance Your Images with Our Versatile PNG Tools",
      redirectTo: "/category/PNG Tools"
    },
    {
      logo: "https://www.svgrepo.com/show/291484/curriculum-resume.svg",
      name: "Resume & HR Tools",
      toolCount: 2,
      tagLine: "Streamline Your Hiring Process with Our Comprehensive Resume & HR Tools",
      redirectTo: "/category/Resume & HR Tools"
    },
    {
      logo: "https://cdn-icons-png.flaticon.com/512/6230/6230391.png",
      name: "Utility Tools",
      toolCount: 11,
      tagLine: "Empowering Efficiency: Your One-Stop Solution for Essential Tools",
      redirectTo: "/category/Utility Tools"
    }
  ];
  
  export default categories;