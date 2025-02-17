'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { CldUploadButton } from 'next-cloudinary';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
const QuillEditor = dynamic(() => import('@/components/ui/editor'), {
  ssr: false,
});

export default function UpdateProduct() {
  interface ProductData {
    id: string;
    title: string;
    price: number;
    productLink: string;
    imageLink: string;
    description: string;
  }
  const { id } = useParams();
  const [disabled, setDisabled] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    id: '',
    title: '',
    price: 0,
    productLink: '',
    imageLink: '',
    description: '',
  });

  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await trpc.product.getProduct.mutate({ id: id[0] });
        if (data) {
          setProductData({
            id: data.message._id,
            title: data.message.title,
            price: data.message.price,
            productLink: data.message.productLink,
            imageLink: data.message.imageLink,
            description: data.message.description,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, [id]);

  const submitHandler = async () => {
    try {
      const data = await trpc.product.updateProduct.mutate(productData);
      setDisabled(true);
      if (data.message == 'UPDATED') {
        toast('Product Updated');
      }
      router.push('/dashboard/product/show')
      setProductData({
        id: '',
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
          <CardTitle>Update Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Productc Title</Label>
              <Input
                name="title"
                value={productData.title}
                onChange={(e) =>
                  setProductData({ ...productData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                name="price"
                type="number"
                value={productData.price}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    price: parseInt(e.target.value),
                  })
                }
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
              <img className='w-20 h-20' src={productData.imageLink} alt="product image" />
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
                onClick={(e:React.MouseEvent<HTMLButtonElement>) => e.preventDefault()} // Prevent default page refresh
              />

              {/* <CldUploadButton
                className="bg-blue-500 p-1 rounded-md text-white"
                options={{
                  sources: ['local'],
                }}
                uploadPreset="ml_default"
                onSuccess={(res) => {
                  const imageUrl = (res.info as { secure_url: string })
                    .secure_url;

                  setProductData({ ...productData, imageLink: imageUrl });
                }}
              /> */}
            </div>
            <div>
              <Label>Product Link</Label>
              <Input
                name="productLink"
                value={productData.productLink}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    productLink: e.target.value,
                  })
                }
                required
              />
            </div>
            <Button
              disabled={disabled}
              onClick={submitHandler}
              className="w-full"
            >
              {disabled ? 'Loading...' : 'Update Product'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
