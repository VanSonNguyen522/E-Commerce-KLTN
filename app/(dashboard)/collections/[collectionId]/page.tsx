"use client"

import CollectionForm from '@/components/collection/CollectionForm';
import Loader from '@/components/custom ui/Loader';
import { useEffect, useState, useCallback } from 'react';

const CollectionDetail = ({ params }: { params: { collectionId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);

  const getCollectionDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: 'GET',
      });
      const data = await res.json();
      setCollectionDetails(data);
      setLoading(false);
    } catch (err) {
      console.log('[collectionId_GET]', err);
    }
  }, [params.collectionId]); // Dependency của useCallback

  useEffect(() => {
    getCollectionDetails();
  }, [getCollectionDetails]); // Dependency của useEffect

  return loading ? <Loader /> : (
    <div>
      <CollectionForm initialData={collectionDetails} />
    </div>
  );
};

export default CollectionDetail;