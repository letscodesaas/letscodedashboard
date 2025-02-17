'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { CldUploadButton } from 'next-cloudinary';
const QuillEditor = dynamic(() => import('@/components/ui/editor'), {
  ssr: false,
});

export default function CreateProduct() {
  interface ProductData {
    title: string;
    price: number;
    productLink: string;
    imageLink: string;
    description: string;
  }

  const [disabled, setDisabled] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    title: '',
    price: 0,
    productLink: '',
    imageLink: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async () => {
    try {
      const data = await trpc.product.createProduct.mutate({
        title: productData.title,
        price: parseInt(productData.price.toString()),
        productLink: productData.productLink,
        imageLink: productData.imageLink,
        description: productData.description,
      });
      setDisabled(true);
      if (data.message == 'created') {
        toast('Product Listed');
      }
      setProductData({
        title: '',
        price: 0,
        productLink: '',
        imageLink: '',
        description: '',
      });
      setDisabled(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast('Server Error');
      console.log(error);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Productc Title</Label>
              <Input name="title" onChange={handleChange} required />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                name="price"
                type="number"
                onChange={handleChange}
                required
              />
            </div>
            <div className="pb-10">
              <Label>Description</Label>
              <QuillEditor
                value={productData.description}
                onChange={(content: string) =>
                  setProductData((prev) => ({ ...prev, description: content }))
                }
              />
            </div>
            <div className="space-y-4 flex flex-col">
              <Label>Product Image</Label>
              {productData.imageLink ? (
                <img
                  className="w-20 h-20"
                  src={productData.imageLink}
                  alt="product image"
                />
              ) : null}
              <CldUploadButton
                className="bg-blue-500 p-1 rounded-md text-white"
                options={{ sources: ['local'] }}
                uploadPreset="ml_default"
                onSuccess={(res) => {
                  if (res?.info) {
                    const imageUrl = (res.info as { secure_url: string })
                      .secure_url;
                    setProductData((prev) => ({
                      ...prev,
                      imageLink: imageUrl,
                    }));
                  }
                }}
                onError={(error) => console.error('Upload Error:', error)}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  e.preventDefault()
                } // Prevent default page refresh
              />
            </div>
            <div>
              <Label>Product Link</Label>
              <Input name="productLink" onChange={handleChange} required />
            </div>
            <Button
              disabled={disabled}
              onClick={submitHandler}
              className="w-full"
            >
              {disabled ? 'Loading...' : 'Create Product'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
