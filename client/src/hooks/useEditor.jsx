import { useContext } from 'react';
import { EditorContext } from '../context/EditorContext';

export const useEditor = () => {
  return useContext(EditorContext);
};