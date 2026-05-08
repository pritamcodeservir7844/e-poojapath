import { toast } from "sonner";

export const devToast = {
  success: (msg: string) =>
    toast(msg, {
      icon: "🪔",
      style: {
        background: "#FDF8F0",
        border: "1px solid #D4820A",
        color: "#0F0A05",
        fontFamily: "Hind, sans-serif",
      },
    }),

  error: (msg: string) =>
    toast(msg, {
      icon: "🙏",
      style: {
        background: "#FFF0F0",
        border: "1px solid #C2567A",
        color: "#0F0A05",
        fontFamily: "Hind, sans-serif",
      },
    }),

  loading: (msg: string) =>
    toast.loading(msg, {
      icon: "🛕",
      style: {
        background: "#FDF8F0",
        border: "1px solid #8B6DB5",
        fontFamily: "Hind, sans-serif",
      },
    }),

  blessing: (msg: string) =>
    toast(msg, {
      description: "ॐ नमः शिवाय • Har Har Mahadev",
      icon: "🌸",
      duration: 4000,
      style: {
        background: "linear-gradient(135deg, #FDF8F0, #FFF5E1)",
        border: "1px solid #B8860B",
        fontFamily: "Hind, sans-serif",
      },
    }),
};
