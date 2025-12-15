import { NextPage } from 'next';
import Layout from '@/components/Layout'; // Assuming standard layout exists
import { VoiceInventory } from '@/components/VoiceInventory';
import Head from 'next/head';

const InventoryVoicePage: NextPage = () => {
    return (
        <Layout>
            <Head>
                <title>Inventario por Voz | Racom POS</title>
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <VoiceInventory />
            </div>
        </Layout>
    );
};

export default InventoryVoicePage;
