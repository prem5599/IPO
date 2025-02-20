import IPOPlatform from '../components/IPOPlatform/IPOPlatform';
import { getCachedIPOData } from '../lib/ipoCache';

export default async function HomePage() {
  const ipoData = await getCachedIPOData();

  return <IPOPlatform initialData={ipoData} />;
}