/**
 * Vercel Serverless Function: Send Instant Estimate via Resend API
 * Path: /api/send-estimate
 * Supports both standard exterior cleaning and seasonal Christmas Light Installation estimates.
 */

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    isHoliday = false,
    quoteId = '#SLK-2026-0000',
    issueDate = new Date().toLocaleDateString('en-US'),
    customerName = 'Valued Customer',
    customerPhone = 'Not provided',
    customerEmail,
    customerAddress = 'Tampa Bay Area, FL',
    homeSize = 'Standard',
    stories = '1 Story',
    panes = 'N/A',
    panels = 'N/A',
    services = [],
    servicesText = '',
    duration = '2 - 3 Hours',
    totalAmount = '$0',
    pdfBase64,
    // Christmas Lights specific fields
    rooflineCoverage = 'Front Only',
    lightColor = 'Classic Warm White',
    referralSource = 'Not specified',
    specialNotes = ''
  } = req.body || {};

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ownerEmails = (process.env.OWNER_EMAIL || 'rlsolutionsfl@hotmail.com')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);
  // Resend allows 'onboarding@resend.dev' for free testing before verifying custom domain
  const rawFrom = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const fromEmailAddress = rawFrom.includes('<') ? rawFrom.split('<')[1].replace('>', '').trim() : rawFrom.trim();

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY environment variable is not configured in Vercel.');
    return res.status(200).json({
      success: false,
      reason: 'not_configured',
      message: 'RESEND_API_KEY is not set in Vercel environment variables.'
    });
  }

  const cleanId = quoteId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Attachments array for Resend
  const attachments = [];
  if (pdfBase64) {
    const filename = isHoliday
      ? `Sleek_Holiday_Lights_Estimate_${cleanId}.pdf`
      : `Sleek_Clean_Estimate_${cleanId}.pdf`;
    attachments.push({
      filename,
      content: pdfBase64
    });
  }

  let customerSubject = '';
  let ownerSubject = '';
  let customerHtml = '';
  let ownerHtml = '';
  let senderName = '';

  if (isHoliday) {
    senderName = 'Sleek Holiday Lighting';
    customerSubject = `🎄 Your Christmas Light Installation Estimate - Sleek Holiday Lighting (${quoteId})`;
    ownerSubject = `🎄 New Christmas Light Lead: ${customerName} (${rooflineCoverage}) - ${quoteId}`;

    // 1. Festive Email Template for the Customer
    customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #0c1913; color: #1e293b; }
          .container { max-width: 620px; margin: 24px auto; background: #ffffff; border-radius: 14px; border: 2px solid #b91c1c; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.25); }
          .holiday-banner { background: linear-gradient(135deg, #14532d 0%, #064e3b 50%, #7f1d1d 100%); padding: 34px 24px; text-align: center; color: #ffffff; position: relative; }
          .holiday-tag { display: inline-block; background: #dc2626; color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; margin-bottom: 12px; }
          .holiday-banner h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .holiday-banner p { margin: 8px 0 0 0; color: #fef08a; font-size: 14px; font-weight: 500; }
          .body-content { padding: 32px 24px; }
          .meta-card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 18px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .meta-item { font-size: 13px; color: #475569; }
          .meta-item strong { color: #991b1b; display: block; font-size: 14px; margin-top: 2px; }
          .holiday-features { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; margin-bottom: 24px; }
          .holiday-features h4 { margin: 0 0 10px 0; color: #166534; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          .holiday-features ul { margin: 0; padding-left: 20px; font-size: 13.5px; color: #1e293b; line-height: 1.6; }
          .total-box { background: linear-gradient(135deg, #fef2f2 0%, #ecfdf5 100%); border: 2px dashed #dc2626; border-radius: 10px; padding: 22px; text-align: center; margin-bottom: 24px; }
          .total-label { font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 1px; }
          .total-price { font-size: 32px; font-weight: 900; color: #15803d; margin: 6px 0; }
          .early-bird-pill { display: inline-block; background: #dc2626; color: #ffffff; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-top: 6px; }
          .cta-btn { display: inline-block; background: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; margin: 12px 0 20px 0; box-shadow: 0 4px 12px rgba(220,38,38,0.3); }
          .disclaimer { font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 18px; }
          .footer { background: #0f172a; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="holiday-banner">
            <span class="holiday-tag">🎄 Holiday Lighting Division</span>
            <h1>Sleek Holiday Lighting</h1>
            <p>Christmas Light Installation Estimate • Ref: ${quoteId}</p>
          </div>
          <div class="body-content">
            <p style="font-size: 16px; margin-top: 0;">Hi <strong>${customerName}</strong>,</p>
            <p style="line-height: 1.6; color: #334155;">Thank you for requesting a Christmas Light Installation quote with <strong>Sleek Window Cleaning & Holiday Lighting</strong>! We've reserved your early bird spot for the 2026 holiday season in the Tampa Bay area.</p>
            
            <div class="meta-card">
              <div class="meta-item">Customer:<strong>${customerName}</strong></div>
              <div class="meta-item">Date:<strong>${issueDate}</strong></div>
              <div class="meta-item">Service Address:<strong>${customerAddress}</strong></div>
              <div class="meta-item">Coverage Area:<strong>${rooflineCoverage}</strong></div>
              <div class="meta-item">Lighting Color Theme:<strong>${lightColor}</strong></div>
              <div class="meta-item">Property Stories:<strong>${stories}</strong></div>
            </div>

            <div class="holiday-features">
              <h4>✨ What's Included In Your Turnkey Holiday Package:</h4>
              <ul>
                <li><strong>Custom-Fitted Commercial C9 LEDs:</strong> Hand-cut specifically to your roofline, gutters, and peaks with seamless hidden wiring.</li>
                <li><strong>Professional, Insured Installation:</strong> No dangerous ladders or electrical risks for homeowners.</li>
                <li><strong>100% In-Season Maintenance Guarantee:</strong> Bulb out or heavy storm? We come out within 24-48h for free.</li>
                <li><strong>Post-Holiday Takedown & Safe Storage:</strong> We carefully remove all lights in January and keep them in climate-controlled storage until next year.</li>
              </ul>
            </div>

            <div class="total-box">
              <span class="early-bird-pill">🎁 50% OFF EARLY BIRD SPECIAL APPLIED</span>
              <div class="total-label" style="margin-top: 10px;">Estimated Holiday Investment</div>
              <div class="total-price">${totalAmount}</div>
              <div style="font-size: 13px; color: #475569;">+ FREE Takedown & Climate-Controlled Storage (Deal Ends December 1st)</div>
            </div>

            <div style="text-align: center;">
              <p style="font-size: 14px; color: #334155; margin-bottom: 6px;">Your detailed <strong>Christmas Lighting Proposal PDF</strong> is attached to this email.</p>
              <a href="tel:7272699002" class="cta-btn">Call Us: (727) 269-9002</a>
            </div>

            <div class="disclaimer">
              <strong>Please Note:</strong> This preliminary quote is prepared by Sleek Window Cleaning LLC. We provide complete turnkey commercial-grade lighting systems and do not install pre-owned customer lights for safety and electrical compliance. Final pricing is confirmed upon on-site visual assessment.
            </div>
          </div>
          <div class="footer">
            © 2026 Sleek Window Cleaning & Holiday Lighting LLC • 126 Woodlake Wynde, Oldsmar, FL 34677<br>
            Phone: (727) 269-9002 • Web: www.sleekwindowcleaning.com
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. Festive Lead Notification for the Owner
    ownerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; padding: 20px; color: #0f172a; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 3px solid #dc2626; padding: 24px; }
          .badge { display: inline-block; background: #166534; color: #fff; font-weight: 800; font-size: 12px; padding: 6px 12px; border-radius: 6px; letter-spacing: 0.5px; }
          h2 { margin-top: 12px; color: #991b1b; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          td.label { font-weight: 600; color: #475569; width: 160px; }
          .total-highlight { background: #fef2f2; border: 2px dashed #dc2626; padding: 14px; border-radius: 8px; font-size: 18px; font-weight: bold; color: #991b1b; text-align: center; margin-top: 20px; }
          .referral-highlight { background: #f0fdf4; border: 1px solid #86efac; color: #166534; font-weight: 700; padding: 3px 8px; border-radius: 4px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">🎄 NEW CHRISTMAS LIGHT LEAD</span>
          <h2>Holiday Lighting Quote: ${quoteId}</h2>
          <p>A prospective client just requested a Christmas Light Installation quote on Sleek Cleans!</p>
          
          <table>
            <tr><td class="label">Client Name:</td><td><strong>${customerName}</strong></td></tr>
            <tr><td class="label">Phone:</td><td><a href="tel:${customerPhone}"><strong>${customerPhone}</strong></a></td></tr>
            <tr><td class="label">Email:</td><td><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
            <tr><td class="label">Address:</td><td><strong>${customerAddress}</strong></td></tr>
            <tr><td class="label">Stories:</td><td>${stories}</td></tr>
            <tr><td class="label">Coverage Area:</td><td><strong>${rooflineCoverage}</strong></td></tr>
            <tr><td class="label">Light Theme:</td><td><strong>${lightColor}</strong></td></tr>
            <tr><td class="label">How heard about us:</td><td><span class="referral-highlight">${referralSource}</span></td></tr>
            <tr><td class="label">Special Notes:</td><td>${specialNotes || 'None specified'}</td></tr>
          </table>

          <div class="total-highlight">
            Estimated Investment: ${totalAmount}<br>
            <span style="font-size: 13px; color: #15803d; font-weight: normal;">50% Early Bird Special Applied (Ends Dec 1st)</span>
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 16px;">The complete Christmas Estimate PDF is attached to this email.</p>
        </div>
      </body>
      </html>
    `;
  } else {
    senderName = 'Sleek Window Cleaning';
    customerSubject = `Your Instant Estimate Summary - Sleek Window Cleaning (${quoteId})`;
    ownerSubject = `🔥 New Estimate Lead: ${customerName} (${totalAmount}) - ${quoteId}`;

    // Build service table HTML for standard cleaning
    let servicesRowsHtml = '';
    if (Array.isArray(services) && services.length > 0) {
      servicesRowsHtml = services.map(s => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 16px; font-weight: 600; color: #0f172a;">${s.title}</td>
          <td style="padding: 12px 16px; color: #64748b; font-size: 14px;">${s.scope}</td>
          <td style="padding: 12px 16px; text-align: right; font-weight: 700; color: #0284c7;">${s.price}</td>
        </tr>
      `).join('');
    } else {
      servicesRowsHtml = `
        <tr>
          <td colspan="3" style="padding: 12px 16px; color: #64748b; font-style: italic;">
            ${servicesText.replace(/\n/g, '<br>') || 'General Exterior Cleaning Services'}
          </td>
        </tr>
      `;
    }

    // Standard Customer HTML
    customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
          .container { max-width: 620px; margin: 24px auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; color: #94a3b8; font-size: 14px; }
          .body-content { padding: 32px 24px; }
          .meta-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .meta-item { font-size: 13px; color: #64748b; }
          .meta-item strong { color: #0f172a; display: block; font-size: 14px; margin-top: 2px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .table th { background: #f1f5f9; padding: 10px 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
          .total-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px; }
          .total-label { font-size: 13px; font-weight: 600; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px; }
          .total-price { font-size: 32px; font-weight: 800; color: #0284c7; margin: 4px 0; }
          .disclaimer { font-size: 12px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 18px; }
          .cta-btn { display: inline-block; background: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 12px 0 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://sleekcleans.com/assets/images/logos/Sleek_Logo_Main-white.svg" alt="Sleek Window Cleaning" height="38" style="display: block; margin: 0 auto 10px auto; max-width: 220px;">
            <p style="margin: 0; color: #94a3b8; font-size: 14px;">Instant Estimate Summary • Reference ${quoteId}</p>
          </div>
          <div class="body-content">
            <p style="font-size: 16px; margin-top: 0;">Hi <strong>${customerName}</strong>,</p>
            <p style="line-height: 1.6; color: #475569;">Thank you for requesting an estimate with <strong>Sleek Window Cleaning</strong>! Here is the summary of your instant estimate for services in the Tampa Bay area.</p>
            
            <div class="meta-card">
              <div class="meta-item">Customer:<strong>${customerName}</strong></div>
              <div class="meta-item">Date:<strong>${issueDate}</strong></div>
              <div class="meta-item">Address:<strong>${customerAddress}</strong></div>
              <div class="meta-item">Estimated Duration:<strong>${duration}</strong></div>
            </div>

            <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 12px;">Selected Services</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Scope</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${servicesRowsHtml}
              </tbody>
            </table>

            <div class="total-box">
              <div class="total-label">Total Estimated Investment</div>
              <div class="total-price">${totalAmount}</div>
              <div style="font-size: 13px; color: #64748b;">${panes !== 'N/A' ? panes + ' • ' : ''}${homeSize} • ${stories}</div>
            </div>

            <div style="text-align: center;">
              <p style="font-size: 14px; color: #475569; margin-bottom: 6px;">We have also attached your detailed <strong>Estimate Summary PDF</strong> to this email.</p>
              <a href="tel:7272699002" class="cta-btn">Call Us: (727) 269-9002</a>
            </div>

            <div class="disclaimer">
              <strong>Please Note:</strong> This document is a preliminary cost estimate prepared by Sleek Window Cleaning LLC. Estimated duration and pricing are approximations based on property specifications provided online. Final pricing and service scope are subject to on-site visual inspection and confirmation.
            </div>
          </div>
          <div class="footer">
            © 2026 Sleek Window Cleaning LLC • 126 Woodlake Wynde, Oldsmar, FL 34677<br>
            Phone: (727) 269-9002 • Web: www.sleekwindowcleaning.com
          </div>
        </div>
      </body>
      </html>
    `;

    // Standard Owner HTML
    ownerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; padding: 20px; color: #0f172a; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; padding: 24px; }
          .badge { display: inline-block; background: #0284c7; color: #fff; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 4px; }
          h2 { margin-top: 10px; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          td.label { font-weight: 600; color: #475569; width: 140px; }
          .total-highlight { background: #f0f9ff; padding: 14px; border-radius: 6px; font-size: 18px; font-weight: bold; color: #0369a1; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">NEW WEBSITE LEAD</span>
          <h2>Instant Estimate Request: ${quoteId}</h2>
          <p>A prospective client just requested an instant estimate on Sleek Cleans.</p>
          
          <table>
            <tr><td class="label">Client Name:</td><td><strong>${customerName}</strong></td></tr>
            <tr><td class="label">Phone:</td><td><a href="tel:${customerPhone}">${customerPhone}</a></td></tr>
            <tr><td class="label">Email:</td><td><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
            <tr><td class="label">Address:</td><td>${customerAddress}</td></tr>
            <tr><td class="label">Home Size:</td><td>${homeSize}</td></tr>
            <tr><td class="label">Stories:</td><td>${stories}</td></tr>
            <tr><td class="label">Panes:</td><td>${panes}</td></tr>
            <tr><td class="label">Solar Panels:</td><td>${panels}</td></tr>
            <tr><td class="label">Est. Duration:</td><td>${duration}</td></tr>
          </table>

          <h3 style="margin-top: 20px; font-size: 15px;">Selected Services:</h3>
          <p style="white-space: pre-line; background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 13px; color: #334155;">${servicesText}</p>

          <div class="total-highlight">
            Estimated Investment: ${totalAmount}
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 16px;">The complete estimate PDF is attached to this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  const finalFromHeader = `${senderName} <${fromEmailAddress}>`;

  try {
    const emailPromises = [];

    // Send to business owner
    emailPromises.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: finalFromHeader,
          to: ownerEmails,
          subject: ownerSubject,
          html: ownerHtml,
          attachments: attachments.length > 0 ? attachments : undefined
        })
      })
    );

    // Send confirmation to customer if email is provided
    if (customerEmail && customerEmail.includes('@')) {
      emailPromises.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: finalFromHeader,
            to: [customerEmail],
            reply_to: ownerEmails[0] || 'rlsolutionsfl@hotmail.com',
            subject: customerSubject,
            html: customerHtml,
            attachments: attachments.length > 0 ? attachments : undefined
          })
        })
      );
    }

    const responses = await Promise.all(emailPromises);
    const results = await Promise.all(responses.map(r => r.json()));

    // Check if any request returned an error from Resend
    const resendError = results.find(r => r.statusCode && r.statusCode >= 400);
    if (resendError) {
      console.error('Resend API returned error:', resendError);
      return res.status(200).json({
        success: false,
        reason: 'resend_error',
        error: resendError.message || 'Error from Resend'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Estimate emails sent successfully with PDF attachment.'
    });
  } catch (err) {
    console.error('Error sending estimate emails via Resend:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
}
