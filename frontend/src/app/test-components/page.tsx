'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SearchInput } from '@/components/ui/SearchInput';

export default function TestComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Testing UI Components</h1>

      <section className="mb-8">
        <h2 className="mb-2 font-semibold">Search Input</h2>
        <SearchInput onSearch={(q) => setSearchQuery(q)} />
        <p className="mt-2">Query: {searchQuery}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-semibold">Button Examples</h2>
        <Button variant="primary" className="mr-2">Primary</Button>
        <Button variant="secondary" className="mr-2" loading>Loading</Button>
        <Button variant="outline" className="mr-2">Outline</Button>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-semibold">Input Examples</h2>
        <Input label="Text Input" placeholder="Type here..." className="mb-4" />
        <Input
          label="Password Input"
          type="password"
          placeholder="Password"
          showPasswordToggle
          className="mb-4"
        />
      </section>
    </main>
  );
}
