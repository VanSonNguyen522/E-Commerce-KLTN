import {
    LayoutDashboard,
    Shapes,
    ShoppingBag,
    Tag,
    UsersRound,
    MessageCircle,
    TicketX
  } from "lucide-react";
  
  export const navLinks = [
    {
      url: "/",
      icon: <LayoutDashboard />,
      label: "Bảng điều khiển",
    },
    {
      url: "/collections",
      icon: <Shapes />,
      label: "Bộ sưu tập",
    },
    {
      url: "/products",
      icon: <Tag />,
      label: "Sản phẩm",
    },
    {
      url: "/orders",
      icon: <ShoppingBag />,
      label: "Đơn hàng",
    },
    {
      url: "/customers",
      icon: <UsersRound />,
      label: "Khách hàng",
    },
    {
      url: "/comments",
      icon: <MessageCircle />,
      label: "Bình luận",
    },
        {
      url: "/refunds",
      icon: <TicketX />,
      label: "Hoàn trả",
    },
  ];