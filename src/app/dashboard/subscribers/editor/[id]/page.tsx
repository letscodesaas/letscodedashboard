'use client';
import React, { useState } from 'react';
import EmailEdit from '@/components/ui/emailEditor';
import SendBulkMail from '../../_components/Send';
import { useParams } from 'next/navigation';
import HtmlEditor from '../../_components/htmlEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
function Page() {
  const id = useParams();
  const [isFocues, setIsFocues] = useState<boolean | null>(false);
  return (
    <div>
      <div className="mb-5 mt-3 flex items-center justify-end">
        <SendBulkMail topic={id.id as string} />
      </div>
      <Tabs defaultValue="htmleditor">
        <TabsList>
          <TabsTrigger value="htmleditor" onClick={() => setIsFocues(false)}>
            Html Editor
          </TabsTrigger>
          <TabsTrigger value="emaileditor" onClick={() => setIsFocues(true)}>
            Email Editor
          </TabsTrigger>
        </TabsList>
        <TabsContent value="htmleditor">
          <HtmlEditor/>
        </TabsContent>
        <TabsContent value="emaileditor">
          <EmailEdit focus={isFocues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Page;
