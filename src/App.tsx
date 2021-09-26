import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="pt-5 mx-auto px-4 flex-1">
      <div className="text-center text-gray-300">
        <h1 className="py-5 my-5">React + TypeScript + TailwindCSS <br /> boilerplate starter project</h1>
        <h2 className="py-5 text-gray-500">Demo:</h2>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src="https://picsum.photos/id/200/300" alt="Man looking at item at a store" />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Case study</div>
            <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Finding customers for your new business</a>
            <p className="mt-2 text-gray-500">Getting a new business off the ground is a lot of hard work. Here are five ideas you can use to find your first customers.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
