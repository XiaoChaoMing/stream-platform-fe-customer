import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to my website",
      description: "This is a multilingual app",
      
      // Channel related translations
      channel: {
        followers: "followers",
        follow: "Follow",
        following: "Following",
        notifications: "Notifications", 
        share: "Share channel",
        settings: "Settings",
        goLive: "Go Live",
        
        // Navigation
        home: "Home",
        about: "About",
        videos: "Videos",
        schedule: "Schedule",
        
        // Content sections
        recentVideos: "Recent Videos",
        viewAll: "View All",
        channelOffline: "Channel Offline",
        streamInfo: "Live: Playing",
        lastLive: "Last live",
        daysAgo: "days ago",
        viewers: "viewers",
        views: "views"
      },
      
      // Error pages
      error: {
        "404Title": "Channel Not Found",
        "404Description": "The channel you're looking for doesn't exist or may have been removed."
      },
      
      // Common elements
      common: {
        navigation: {
          returnToChannelList: "Return to Channel List"
        }
      }
    }
  },
  vi: {
    translation: {
      welcome: "Chào mừng đến với trang web của tôi",
      description: "Đây là một ứng dụng đa ngôn ngữ",
      
      // Channel related translations
      channel: {
        followers: "người theo dõi",
        follow: "Theo dõi",
        following: "Đang theo dõi",
        notifications: "Thông báo",
        share: "Chia sẻ kênh",
        settings: "Cài đặt",
        goLive: "Phát trực tiếp",
        
        // Navigation
        home: "Trang chủ",
        about: "Giới thiệu",
        videos: "Video",
        schedule: "Lịch phát sóng",
        
        // Content sections
        recentVideos: "Video gần đây",
        viewAll: "Xem tất cả",
        channelOffline: "Kênh không trực tuyến",
        streamInfo: "Trực tiếp: Đang chơi",
        lastLive: "Trực tiếp gần đây",
        daysAgo: "ngày trước",
        viewers: "người xem",
        views: "lượt xem"
      },
      
      // Error pages
      error: {
        "404Title": "Không tìm thấy kênh",
        "404Description": "Kênh bạn đang tìm kiếm không tồn tại hoặc có thể đã bị xóa."
      },
      
      // Common elements
      common: {
        navigation: {
          returnToChannelList: "Quay lại danh sách kênh"
        }
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
