import InputBar from "@/features/generator/components";

// TODO: convert to CSS module
const HomePageStyle = {
  container: {
    display: "flex",
    // flexDirection: "column",
    height: "100vh",
    width: "100%",
  },
  inputBarWrapper: {
    height: "35%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default function HomePage() {
  return (
    <div style={HomePageStyle.container} className="flex-col">
      <div style={HomePageStyle.inputBarWrapper}>
        <InputBar />
      </div>
    </div>
  );
}
