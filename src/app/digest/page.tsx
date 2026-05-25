import { redirect } from 'next/navigation';

export default function DigestIndexRedirect() {
  redirect('/digest/en');
}
