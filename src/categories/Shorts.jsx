import CategoryPageLayout from "./CategoryPageLayout.jsx";

export default function Shorts({ onShopAll }) {
  return <CategoryPageLayout title="Shorts" description="Light, comfortable shorts made for slower days and warmer weather." image="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85" onShopAll={onShopAll} />;
}
