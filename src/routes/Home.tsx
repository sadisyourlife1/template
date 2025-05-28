import HotRightNow from '../components/HotRightNow';
import PopularTracks from '../components/PopularTracks';
import '../style.css'; 

export default function Home() {
  return (
    <>
      <div className="content-top">
        <h1 className="content-top-header">Music</h1>
      </div>
      <HotRightNow />
      <PopularTracks />
    </>
  );
}
