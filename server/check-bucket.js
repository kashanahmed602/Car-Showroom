import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function makeBucketPublic() {
  const { data, error } = await supabase.storage.updateBucket('car-showroom', {
    public: true
  });

  if (error) {
    console.error('Error making bucket public:', error);
  } else {
    console.log('Bucket "car-showroom" is now PUBLIC!', data);
  }

  // Verify
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucket = buckets.find(b => b.name === 'car-showroom');
  console.log(`Verified: car-showroom public = ${bucket.public}`);
}

makeBucketPublic();
