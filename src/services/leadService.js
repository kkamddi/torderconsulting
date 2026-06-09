export async function handleLeadSubmit(form) {
  const formData = {
    store_name: form.storeName.trim(),
    owner_name: form.ownerName.trim(),
    phone: form.phone.trim(),
    region: form.region.trim(),
    business_type: form.businessType,
    table_count: Number(form.tableCount),
    order_method: form.orderMethod,
    concern: form.concern,
    preferred_time: form.preferredTime,
    privacy_agreed: form.privacy,
  };

  console.log('상담 신청 정보', formData);

  await new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });

  return { ok: true, lead: formData };
}
