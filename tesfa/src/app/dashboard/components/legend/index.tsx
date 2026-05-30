export default function MapLegend() {
  const items = [
    { color: "bg-[#E8543A]", label: "Active war Areas" },
    { color: "bg-[#BA6D58]", label: "Post war Areas" },
    { color: "bg-[#386c80ff]", label: "No war Areas" },
    { color: "bg-primary-dark", label: "Not covered yet" },
  ];
  return (
    <div className="absolute z-[1150] bottom-6 left-6 p-5 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl min-w-[14rem]">
      <h3 className="font-semibold mb-4 text-sm tracking-wide uppercase text-gray-500">
        Key
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`w-5 h-5 shrink-0 rounded-sm ${item.color}`}></span>
            <p className="text-sm text-gray-900">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
