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
      label: "Dashboard",
    },
    {
      url: "/collections",
      icon: <Shapes />,
      label: "Collections",
    },
    {
      url: "/products",
      icon: <Tag />,
      label: "Products",
    },
    {
      url: "/orders",
      icon: <ShoppingBag />,
      label: "Orders",
    },
    {
      url: "/customers",
      icon: <UsersRound />,
      label: "Customers",
    },
    {
      url: "/comments",
      icon: <MessageCircle />,
      label: "Comments",
    },
        {
      url: "/refunds",
      icon: <TicketX />,
      label: "Refunds",
    },
  ];