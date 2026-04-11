import discoveryMetadata from '@/app/data/serviceDiscoveryKeywords.json';
import { SERVICE_CATEGORIES, type ServiceCategory } from '@/app/data/servicesData';

export type DiagnosticKnowledgeEntry = {
  name: string;
  definition: string;
  prep: string[];
  time: string;
  categoryId?: string;
  categoryTitle?: string;
};

type DiscoveryMetadataEntry = {
  key: string;
  description: string;
  keywords: string[];
};

type PrimaryServiceReference = {
  categoryId: string;
  categoryTitle: string;
  testId: string;
  name: string;
  normalizedName: string;
};

const LEGACY_CATEGORY_PAGE_SERVICES = [
  '24-hour Holter Monitoring',
  '3D Mammogram',
  '48-hour Holter Monitoring',
  '4D Obstetric Ultrasound',
  'Abdominal CT Scan',
  'Abdominal MRI',
  'Abdominal X-Ray',
  'Ambulatory ECG',
  'Ambulatory EEG',
  'Biopsy during Esophagoscopy',
  'Biopsy during Gastroscopy',
  'Biopsy during Pharyngoscopy',
  'Blood Chemistry Panel',
  'Blood Glucose Test',
  'Bone Density Scan',
  'Bone X-Ray',
  'Brain MRI',
  'Chest CT Scan',
  'Chest X-Ray',
  'Complete Blood Count (CBC)',
  'CT Angiography',
  'CT Colonography',
  'CT Scan',
  'Dental X-Ray',
  'Diagnostic Esophagoscopy',
  'Diagnostic Gastroscopy',
  'Diagnostic Mammogram',
  'Diagnostic Pharyngoscopy',
  'DNA Ancestry Test',
  'DNA Paternity Test',
  'DNA Testing',
  'Doppler Echocardiogram',
  'Esophageal Dilation',
  'Esophagoscopy',
  'Event Recorder',
  'Evoked Potentials',
  'Exercise (Stress) ECG',
  'Extended Holter Monitoring',
  'Fetal Anatomy Scan',
  'Fetal Echocardiogram',
  'Fetal Movement Assessment',
  'Foreign Body Removal',
  'Forensic DNA Analysis',
  'Gastroscopy',
  'Genetic Disease Screening',
  'Growth Scan',
  'Head CT Scan',
  'Helicobacter pylori Testing',
  'Holter Monitoring',
  'Kidney Function Tests',
  'Knee MRI',
  'Liver Function Tests',
  'Mammogram (Breast X-Ray)',
  'MRI Scan',
  'Pelvic CT Scan',
  'Pelvic MRI',
  'PET Scan',
  'Pharmacogenomics',
  'Pharyngeal Tumor Assessment',
  'Placental Position Scan',
  'Polyp Removal',
  'Resting ECG',
  'Routine EEG',
  'Screening Mammogram',
  'Signal-Averaged ECG',
  'Sinus CT Scan',
  'Sleep EEG',
  'Spine CT Scan',
  'Spine MRI',
  'Spine X-Ray',
  'Therapeutic Esophagoscopy',
  'Therapeutic Gastroscopy',
  'Thyroid Function Tests',
  'Transesophageal Echocardiogram (TEE)',
  'Ultrasound Scan',
  'Upper GI Endoscopy',
  'Video EEG Monitoring',
  'X-Ray',
] as const;

const metadataDescriptionByKey = new Map(
  (discoveryMetadata as DiscoveryMetadataEntry[]).map((entry) => [entry.key, entry.description])
);

const normalizeDiagnosticName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const primaryServiceReferences: PrimaryServiceReference[] = SERVICE_CATEGORIES.flatMap((category) =>
  category.tests.map((test) => ({
    categoryId: category.id,
    categoryTitle: category.title,
    testId: test.id,
    name: test.name,
    normalizedName: normalizeDiagnosticName(test.name),
  }))
);

const primaryReferenceByName = new Map<string, PrimaryServiceReference>();

for (const reference of primaryServiceReferences) {
  if (!primaryReferenceByName.has(reference.normalizedName)) {
    primaryReferenceByName.set(reference.normalizedName, reference);
  }
}

const uniqueDiagnosticNames = Array.from(
  new Map(
    [...primaryServiceReferences.map((reference) => reference.name), ...LEGACY_CATEGORY_PAGE_SERVICES].map((name) => [
      normalizeDiagnosticName(name),
      name,
    ])
  ).values()
).sort((a, b) => a.localeCompare(b));

const categoryById = new Map<string, ServiceCategory>(
  SERVICE_CATEGORIES.map((category) => [category.id, category])
);

const FALLBACK_BRIEF = 'Our specialists will provide a detailed brief upon arrival.';

const replaceJoiners = (value: string) =>
  value
    .replace(/\+/g, ' and ')
    .replace(/\//g, ' and ')
    .replace(/\s+/g, ' ')
    .trim();

const stripParenContent = (value: string) =>
  value.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();

const titleCaseRegion = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const formatRegionPhrase = (value: string) => {
  const cleaned = replaceJoiners(stripParenContent(value));
  return cleaned ? titleCaseRegion(cleaned) : '';
};

const getRegionFromModalityName = (name: string, pattern: RegExp, fallback: string) => {
  const cleaned = formatRegionPhrase(name.replace(pattern, ''));
  return cleaned || fallback;
};

const getReferenceForName = (name: string) => primaryReferenceByName.get(normalizeDiagnosticName(name));

const inferCategoryId = (name: string, existingCategoryId?: string) => {
  if (existingCategoryId) return existingCategoryId;

  const normalized = normalizeDiagnosticName(name);

  if (/\bmri\b|\bmrcp\b/.test(normalized)) return 'mri';
  if (/\bct\b|\bcta\b|\bctpa\b|\bhrct\b|\burogram\b|\bkub\b|\bcolonography\b/.test(normalized)) return 'ct-scan';
  if (/\bx ray\b|\bxray\b|\bmammogram\b|\bmammography\b/.test(normalized)) return 'xray';
  if (
    /\bultrasound\b|\becho\b|\bdoppler\b|\bfollicle\b|\bfetal\b|\bpelvic scan\b|\bnt\b/.test(normalized)
    || normalized === 'scan'
  ) {
    return 'scan-ultrasound';
  }
  if (
    /\becg\b|\bholter\b|\babpm\b|\btreadmill\b|\bpacemaker\b|\btilt table\b|\bheart\b|\bcardiac\b|\bilr\b/.test(normalized)
  ) {
    return 'cardiology-ecg';
  }
  if (
    /\beeg\b|\bemg\b|\bncs\b|\bmslt\b|\bpolysomnography\b|\bneuro\b|\bevoked\b|\bbera\b|\bssep\b|\bcognitive\b/.test(normalized)
  ) {
    return 'neurological';
  }
  if (
    /\bdna\b|\bpaternity\b|\bmaternity\b|\bsibling\b|\bancestry\b|\bgenetic\b|\bpharmacogenomics\b|\bforensic\b|\bcarrier\b/.test(normalized)
  ) {
    return 'dna-testing';
  }
  if (
    /\bendoscopy\b|\bgastroscopy\b|\bcolonoscopy\b|\bbronchoscopy\b|\bcystoscopy\b|\bcolposcopy\b|\bercp\b|\besophagoscopy\b|\benteroscopy\b|\bsigmoidoscopy\b|\bnbi\b|\bchromo\b|\bpharyngoscopy\b/.test(normalized)
  ) {
    return 'endoscopy';
  }
  if (
    /\bfobt\b|\bfit\b|\bbiopsy\b|\bpap smear\b|\bhpv\b|\bscreening\b|\bca 125\b|\bca 19 9\b|\bcea\b|\bafp\b|\bpsa\b/.test(normalized)
  ) {
    return 'cancer-screening';
  }
  if (
    /\bblood\b|\burine\b|\bstool\b|\bculture\b|\bpcr\b|\bvitamin\b|\bhba1c\b|\btsh\b|\bmalaria\b|\bhiv\b|\bhbsag\b|\bhcv\b|\bferritin\b|\bcbc\b|\bfbc\b|\bpanel\b|\bprofile\b/.test(normalized)
  ) {
    return 'laboratory';
  }

  return undefined;
};

const buildPrep = (...steps: string[]) => steps.filter(Boolean);

const buildLabKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bfull blood count\b|\bcbc\b|\bfbc\b/.test(normalized)) {
    return {
      definition: 'This blood test checks your red cells, white cells, and platelets to help detect anemia, infection, and other blood-related problems.',
      prep: buildPrep(
        'No fasting is usually needed unless this is being combined with another test.',
        'Drink water before your appointment so sample collection is easier.',
        'Tell the team if you are on blood thinners or recently had a transfusion.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bblood group\b|\brhesus\b/.test(normalized)) {
    return {
      definition: 'This test identifies your blood group and Rh factor, which is important for transfusion safety and pregnancy care.',
      prep: buildPrep(
        'No fasting is needed.',
        'Bring any previous blood group card or result if you have one.',
        'Tell the team if you recently received blood.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bfasting blood sugar\b|\bblood glucose\b|\bblood sugar\b/.test(normalized)) {
    return {
      definition: 'This test checks your blood sugar level to help diagnose or monitor diabetes.',
      prep: buildPrep(
        'Fast for 8 to 10 hours unless your clinician gives different instructions.',
        'Drink plain water only during the fasting period.',
        'Ask before taking diabetes medicine on the morning of the test.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bhba1c\b/.test(normalized)) {
    return {
      definition: 'This blood test shows your average blood sugar level over the last 2 to 3 months.',
      prep: buildPrep(
        'No fasting is usually needed.',
        'Keep taking your routine medicines unless your clinician says otherwise.',
        'Bring previous diabetes results if you have them.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\blipid profile\b/.test(normalized)) {
    return {
      definition: 'This blood test measures cholesterol and triglycerides to assess your heart and blood vessel risk.',
      prep: buildPrep(
        'Fast for 8 to 12 hours unless you were told a non-fasting sample is acceptable.',
        'Avoid alcohol and heavy fatty meals the day before.',
        'Continue water intake so you stay hydrated.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bliver function\b|\blfts\b|\bbilirubin\b|\bamylase\b|\blipase\b|\bprotein\b|\balbumin\b/.test(normalized)) {
    return {
      definition: 'This test checks liver- and digestion-related markers in your blood to help assess liver, bile duct, or pancreatic health.',
      prep: buildPrep(
        'A short fast may be advised, especially if this test is combined with other chemistry tests.',
        'Avoid alcohol for 24 hours before the sample if possible.',
        'Tell the team about any supplements or medicines you are taking.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bcreatinine\b|\begfr\b|\burea\b|\belectrolytes\b|\bmicroalbumin\b|\burine protein\b|\bkidney function\b/.test(normalized)) {
    return {
      definition: 'This test helps check how well your kidneys are filtering waste and balancing body salts.',
      prep: buildPrep(
        'Drink water normally unless your clinician tells you to limit fluids.',
        'Avoid strenuous exercise just before the sample.',
        'Tell the team if you are taking diuretics or kidney medicine.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\btsh\b|\bt3\b|\bt4\b|\bft3\b|\bft4\b|\bthyroid function\b/.test(normalized)) {
    return {
      definition: 'This blood test checks thyroid hormone levels to help explain weight change, tiredness, palpitations, or neck swelling.',
      prep: buildPrep(
        'No fasting is usually needed.',
        'If you take thyroid medicine, ask whether to take it before or after the sample.',
        'Bring previous thyroid results if available.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bmalaria\b|\bhiv\b|\bhbsag\b|\bhcv\b|\bvdrl\b|\bwidal\b|\bbrucella\b|\bdengue\b|\bcovid\b|\bhpv\b|\bchlamydia\b|\bgonorrhoea\b|\bhepatitis\b|\btorch\b|\bprocalcitonin\b/.test(normalized)) {
    return {
      definition: 'This infection-focused test checks for germs, antibodies, or genetic material that may be causing illness.',
      prep: buildPrep(
        'No special preparation is usually needed unless your doctor gave a different instruction.',
        'Tell the team about recent antibiotics or antiviral treatment.',
        'Arrive with your symptoms and any previous test results noted down.'
      ),
      time: normalized.includes('pcr') ? '10 to 15 minutes for sample collection' : '5 to 10 minutes',
    };
  }

  if (/\bpsa\b|\bca 125\b|\bca 19 9\b|\bcea\b|\bafp\b|\bca 15 3\b|\bbeta 2 microglobulin\b|\bldh\b/.test(normalized)) {
    return {
      definition: 'This blood test looks for markers that can support cancer screening, follow-up, or treatment monitoring.',
      prep: buildPrep(
        'No fasting is usually needed unless this test is combined with other blood work.',
        'Tell the team if you recently had surgery, infection, or treatment that may affect the result.',
        'Bring previous reports for comparison when possible.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bfsh\b|\blh\b|\bestradiol\b|\bprogesterone\b|\btestosterone\b|\bprolactin\b|\bcortisol\b|\bamh\b|\bbeta hcg\b|\binsulin\b|\bc peptide\b/.test(normalized)) {
    return {
      definition: 'This hormone test helps assess fertility, pregnancy, puberty, or hormone balance.',
      prep: buildPrep(
        'Some hormone tests must be done on a specific day of the menstrual cycle.',
        'A morning sample may be preferred for hormones such as cortisol.',
        'Tell the team about fertility drugs, steroids, or hormone treatment.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bsemen analysis\b/.test(normalized)) {
    return {
      definition: 'This test checks sperm count, movement, and shape to support fertility assessment.',
      prep: buildPrep(
        'Avoid ejaculation for 2 to 5 days before the sample unless told otherwise.',
        'Avoid lubricants or condoms unless the clinic provided a special collection device.',
        'Deliver the sample exactly as instructed and as quickly as possible.'
      ),
      time: '15 to 20 minutes for collection and handover',
    };
  }

  if (/\bpap smear\b/.test(normalized)) {
    return {
      definition: 'This cervical screening test checks for abnormal cell changes that may need follow-up.',
      prep: buildPrep(
        'Avoid sex, vaginal creams, and douching for 24 to 48 hours before the test.',
        'Try not to book during active menstrual bleeding.',
        'Tell the clinician if you are pregnant or have recent vaginal symptoms.'
      ),
      time: '10 to 15 minutes',
    };
  }

  if (/\burinalysis\b|\burine culture\b/.test(normalized)) {
    return {
      definition: 'This urine test checks for signs of infection, kidney problems, sugar, protein, or other changes.',
      prep: buildPrep(
        'Use the clean container provided and follow the midstream collection steps if instructed.',
        'Avoid contaminating the sample with toilet water or menstrual blood.',
        'Tell the team if you are taking antibiotics.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bstool\b|\bh pylori\b|\bfobt\b|\bfit\b/.test(normalized)) {
    return {
      definition: 'This test examines a stool sample for infection, inflammation, hidden blood, or stomach-related problems.',
      prep: buildPrep(
        'Use the sample container exactly as instructed.',
        'Avoid mixing the stool sample with urine or water.',
        'Return the sample promptly so it can be processed correctly.'
      ),
      time: normalized.includes('fobt') || normalized.includes('fit') ? '5 to 10 minutes for sample collection' : '10 to 15 minutes',
    };
  }

  if (/\bculture\b/.test(normalized)) {
    return {
      definition: 'This test checks a sample for bacteria or other germs so the right treatment can be chosen.',
      prep: buildPrep(
        'Provide the sample before starting antibiotics if your doctor advises this.',
        'Use a clean container and follow the collection instructions carefully.',
        'Return the sample quickly after collection.'
      ),
      time: '10 to 15 minutes for sample collection',
    };
  }

  if (/\bpcr\b/.test(normalized)) {
    return {
      definition: 'This molecular test looks for very small amounts of genetic material from an infection or condition.',
      prep: buildPrep(
        'Follow the sample instructions given for the specific test.',
        'Tell the team about recent treatment that may affect the result.',
        'Bring any previous result for comparison if available.'
      ),
      time: '10 to 15 minutes for sample collection',
    };
  }

  return {
    definition: `This laboratory test checks important markers in your sample to give your doctor more information about ${name}.`,
    prep: buildPrep(
      'Follow any fasting or sample-collection instruction given during booking.',
      'Keep taking routine medicines unless your clinician tells you not to.',
      'Bring previous results if you would like them compared.'
    ),
    time: '5 to 10 minutes for sample collection',
  };
};

const buildUltrasoundKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bobstetric\b|\b4d\b|\banomaly\b|\bnuchal\b|\bfetal\b|\bgrowth scan\b|\bplacental\b/.test(normalized)) {
    return {
      definition: 'This pregnancy ultrasound uses sound waves to check your baby, the placenta, and the pregnancy environment in real time.',
      prep: buildPrep(
        'Drink 4 to 6 glasses of water 1 hour before the scan unless your booking note says otherwise.',
        'Do not empty your bladder until after the scan if you were told to come with a full bladder.',
        'Bring previous pregnancy scan reports if you have them.'
      ),
      time: normalized.includes('4d') ? '20 to 40 minutes' : '15 to 30 minutes',
    };
  }

  if (/\bpelvic\b|\buterus\b|\bovaries\b|\bfibroid\b|\bendometrial\b|\bfollicle\b/.test(normalized)) {
    return {
      definition: 'This ultrasound looks at the uterus, ovaries, and nearby pelvic structures to help explain pain, bleeding, or fertility concerns.',
      prep: buildPrep(
        'Drink water before the scan if you were asked to come with a full bladder.',
        'Wear comfortable clothing that is easy to change.',
        'Bring previous pelvic scan results if available.'
      ),
      time: '20 to 30 minutes',
    };
  }

  if (/\bliver\b|\bgallbladder\b|\bpancreas\b|\bspleen\b|\bappendix\b|\babdominal ultrasound\b/.test(normalized)) {
    return {
      definition: 'This abdominal ultrasound uses sound waves to look at the internal organs in your tummy without radiation.',
      prep: buildPrep(
        'Fast for 6 to 8 hours unless your clinician gives different instructions.',
        'Take only small sips of water for essential medicines if needed.',
        'Bring previous scan reports if you have them.'
      ),
      time: '15 to 25 minutes',
    };
  }

  if (/\brenal\b|\bbladder\b|\bprostate\b|\bscrotal\b|\btesticular\b|\bpenile\b/.test(normalized)) {
    return {
      definition: 'This ultrasound checks the urinary or male reproductive organs to look for swelling, blockage, masses, or other changes.',
      prep: buildPrep(
        'Drink water beforehand if your booking note asks you to come with a full bladder.',
        'Wear loose clothing for easier access to the area being examined.',
        'Bring previous scan or lab results if available.'
      ),
      time: '20 to 30 minutes',
    };
  }

  if (/\becho\b|\bechocardiogram\b|\btee\b|\btte\b|\bstress echocardiogram\b|\bdoppler echocardiogram\b|\bfetal echocardiogram\b/.test(normalized)) {
    return {
      definition: 'This heart ultrasound checks how well your heart chambers, valves, and blood flow are working.',
      prep: buildPrep(
        normalized.includes('stress') || normalized.includes('tee')
          ? 'Follow the fasting or medication instruction given for your stress or transesophageal study.'
          : 'No major preparation is usually needed.',
        'Wear comfortable clothing and bring your heart medicine list.',
        'Arrive a little early if you have previous cardiac reports to share.'
      ),
      time: normalized.includes('tee') ? '45 to 60 minutes' : normalized.includes('stress') ? '45 to 60 minutes' : '25 to 45 minutes',
    };
  }

  if (/\bdoppler\b|\bcimt\b/.test(normalized)) {
    return {
      definition: 'This Doppler ultrasound checks blood flow through your blood vessels to look for narrowing, blockage, or poor circulation.',
      prep: buildPrep(
        'Wear loose clothing so the area can be reached easily.',
        'Avoid tight socks or compression wear just before limb Doppler studies unless your clinician advised otherwise.',
        'Bring previous vascular reports if you have them.'
      ),
      time: '20 to 40 minutes',
    };
  }

  if (/\bbreast\b|\bthyroid\b|\bsoft tissue\b|\blymph node\b|\bshoulder\b|\bknee\b|\bankle\b|\bwrist\b|\bhip\b|\belbow\b|\borbital\b|\bnerve ultrasound\b|\blung ultrasound\b|\binfant hip\b/.test(normalized)) {
    return {
      definition: 'This ultrasound creates live pictures of soft tissues in the area being examined so the clinician can look for swelling, fluid, lumps, or injury.',
      prep: buildPrep(
        'No special preparation is usually needed.',
        'Wear clothing that allows easy access to the area being scanned.',
        'Bring prior imaging for comparison if available.'
      ),
      time: '15 to 30 minutes',
    };
  }

  return {
    definition: `This ultrasound uses sound waves to create live images for ${name}.`,
    prep: buildPrep(
      'Follow the preparation note on your booking confirmation because some scans need fasting or a full bladder.',
      'Wear comfortable clothing and remove bulky jewelry from the area if asked.',
      'Bring previous scans if you have them.'
    ),
    time: '15 to 30 minutes',
  };
};

const buildXRayKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bmammogram\b|\bmammography\b/.test(normalized)) {
    return {
      definition: 'This breast X-ray checks for early changes in breast tissue and helps with routine breast screening or follow-up of symptoms.',
      prep: buildPrep(
        'Do not wear deodorant, powder, or lotion on the chest or underarms on the day of the test.',
        'Wear a two-piece outfit so changing is easier.',
        'Bring previous mammogram images if you have them.'
      ),
      time: normalized.includes('3d') ? '20 to 30 minutes' : '15 to 20 minutes',
    };
  }

  if (/\bbone age\b/.test(normalized)) {
    return {
      definition: 'This X-ray checks how mature the bones in the hand and wrist look compared with your age.',
      prep: buildPrep(
        'No fasting is needed.',
        'Remove jewelry from the hand and wrist before the image is taken.',
        'Tell the team if there is any injury or cast on the hand.'
      ),
      time: '5 to 10 minutes',
    };
  }

  const region = getRegionFromModalityName(name, /\bX[- ]?Ray\b/gi, 'the area your doctor wants to examine');

  return {
    definition: `This X-ray takes quick pictures of ${region} to help check for fractures, alignment problems, infection, or other visible changes.`,
    prep: buildPrep(
      'No special preparation is usually needed.',
      'Remove jewelry, belts, or metal objects from the area being examined.',
      'Tell the radiographer if you may be pregnant.'
    ),
    time: '10 to 15 minutes',
  };
};

const buildMriKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bcardiac mri\b/.test(normalized)) {
    return {
      definition: 'This MRI provides detailed pictures of the heart muscle and blood flow to help assess structure and function.',
      prep: buildPrep(
        'Remove all metal items before the scan.',
        'Tell the team about pacemakers, implants, clips, or claustrophobia before arrival.',
        'Follow the fasting instruction if contrast or medication is planned.'
      ),
      time: '45 to 75 minutes',
    };
  }

  if (/\bwhole body mri\b/.test(normalized)) {
    return {
      definition: 'This MRI captures detailed images from multiple parts of the body during one visit for broad screening or follow-up.',
      prep: buildPrep(
        'Remove all metal objects before entering the MRI room.',
        'Tell the team about any implant, device, metal fragment, or pregnancy.',
        'Wear simple clothing without metal fasteners where possible.'
      ),
      time: '60 to 90 minutes',
    };
  }

  const region = getRegionFromModalityName(name, /\bMRI\b/gi, 'the area being examined');

  return {
    definition: `This MRI uses a strong magnet to create detailed pictures of ${region}, especially soft tissues, nerves, joints, and organs.`,
    prep: buildPrep(
      'Remove jewelry, watches, hairpins, and other metal items before the scan.',
      'Tell the team about implants, surgeries, metal fragments, or severe claustrophobia.',
      normalized.includes('contrast') ? 'Fast for 4 to 6 hours if your booking note asks for contrast preparation.' : 'Follow any contrast instruction given during booking.'
    ),
    time: normalized.includes('contrast') ? '40 to 60 minutes' : '30 to 45 minutes',
  };
};

const buildCtKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bguided biopsy\b/.test(normalized)) {
    return {
      definition: 'This CT-guided procedure uses live scan images to help the doctor take a tissue sample from the exact area of concern.',
      prep: buildPrep(
        'Fast if your booking instructions ask you to.',
        'Tell the team about blood thinners, allergies, or bleeding problems before arrival.',
        'Arrange for someone to take you home if sedation is planned.'
      ),
      time: '45 to 90 minutes',
    };
  }

  if (/\bcta\b|\bangiography\b|\bctpa\b/.test(normalized)) {
    return {
      definition: 'This CT blood-vessel study uses contrast dye to show blood flow and look for narrowing, blockage, or clots.',
      prep: buildPrep(
        'Fast for 4 to 6 hours if instructed.',
        'Tell the team about iodine contrast allergy, asthma, kidney disease, or diabetes medicine.',
        'Drink water after the scan unless your clinician gives other advice.'
      ),
      time: '20 to 45 minutes',
    };
  }

  if (/\bwhole body ct\b/.test(normalized)) {
    return {
      definition: 'This CT study captures images from several body areas during one visit for broad assessment.',
      prep: buildPrep(
        'Follow any fasting or contrast instruction on your booking.',
        'Tell the team about contrast allergy, kidney disease, or pregnancy.',
        'Bring previous imaging if available.'
      ),
      time: '30 to 45 minutes',
    };
  }

  const region = getRegionFromModalityName(name, /\bCT\b|\bCTA\b/gi, 'the area being examined');

  return {
    definition: `This CT scan creates detailed cross-section pictures of ${region} to help detect injury, bleeding, infection, stones, or other internal problems.`,
    prep: buildPrep(
      normalized.includes('contrast') ? 'Fast for 4 to 6 hours if contrast is planned.' : 'Follow the booking note because some CT scans need fasting or contrast preparation.',
      'Tell the team about any contrast allergy, kidney problem, or pregnancy before the scan.',
      'Drink water afterward unless your clinician tells you not to.'
    ),
    time: normalized.includes('contrast') || normalized.includes('triphasic') ? '20 to 40 minutes' : '10 to 20 minutes',
  };
};

const buildEndoscopyKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bcolonoscopy\b|\bsigmoidoscopy\b/.test(normalized)) {
    return {
      definition: 'This camera test looks inside the large bowel to check for bleeding, polyps, inflammation, or other causes of bowel symptoms.',
      prep: buildPrep(
        'Follow the bowel-cleansing medicine plan exactly as given.',
        'Switch to clear fluids the day before if your instructions tell you to.',
        'Arrange for someone to take you home if sedation is planned.'
      ),
      time: '30 to 60 minutes, plus recovery time if sedated',
    };
  }

  if (/\bgastroscopy\b|\bogd\b|\bupper gi endoscopy\b|\besophagoscopy\b|\benteroscopy\b|\beus\b|\bercp\b|\bpharyngoscopy\b/.test(normalized)) {
    return {
      definition: 'This scope test uses a slim camera to look at the throat, food pipe, stomach, or upper digestive tract.',
      prep: buildPrep(
        'Do not eat or drink for 6 to 8 hours before the procedure unless told otherwise.',
        'Tell the team about blood thinners, diabetes medicine, or any allergies.',
        'Arrange transport home if you are having sedation.'
      ),
      time: normalized.includes('ercp') ? '45 to 90 minutes, plus recovery time' : '15 to 30 minutes, plus recovery time if sedated',
    };
  }

  if (/\bbronchoscopy\b/.test(normalized)) {
    return {
      definition: 'This procedure uses a flexible camera to look inside the airways and lungs.',
      prep: buildPrep(
        'Do not eat or drink for 6 to 8 hours before the test unless instructed otherwise.',
        'Tell the team about blood thinners, inhalers, and allergies.',
        'Arrange for someone to accompany you home if sedation is planned.'
      ),
      time: '30 to 60 minutes, plus recovery time',
    };
  }

  if (/\bcystoscopy\b|\bcolposcopy\b/.test(normalized)) {
    return {
      definition: 'This scope test allows the doctor to look directly at the lining of the area being examined and, if needed, take samples.',
      prep: buildPrep(
        'Follow the preparation note given for your specific procedure.',
        'Tell the team about any infection symptoms or blood thinners before arrival.',
        'Bring previous test results if you have them.'
      ),
      time: '20 to 40 minutes',
    };
  }

  if (/\bcapsule endoscopy\b/.test(normalized)) {
    return {
      definition: 'This test uses a small swallowable camera capsule to take pictures through your digestive tract over several hours.',
      prep: buildPrep(
        'Fast overnight or as instructed before swallowing the capsule.',
        'Wear comfortable clothing because you may keep a recorder belt on for several hours.',
        'Follow the food and drink timing instructions exactly after the capsule is taken.'
      ),
      time: '15 minutes for setup, then about 8 hours of recording',
    };
  }

  return {
    definition: `This endoscopic procedure uses a slim camera to help your specialist assess ${name.toLowerCase()}.`,
    prep: buildPrep(
      'Follow the fasting or bowel-preparation instructions in your booking message.',
      'Tell the team about blood thinners, allergies, and other medical conditions before arrival.',
      'Arrange post-procedure transport if sedation is planned.'
    ),
    time: '20 to 45 minutes',
  };
};

const buildCardiologyKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bholter\b|\bevent monitor\b|\bevent recorder\b|\babpm\b|\bilr\b/.test(normalized)) {
    return {
      definition: 'This monitoring test records your heart rhythm or blood pressure over time while you go about your usual activities.',
      prep: buildPrep(
        'Wear loose clothing so the monitor can sit comfortably.',
        'Bathe before your appointment because some monitors should not get wet.',
        'Keep a symptom diary if the team asks you to.'
      ),
      time: '10 to 20 minutes to fit the monitor',
    };
  }

  if (/\bstress\b|\btreadmill\b|\bdobutamine\b|\btilt table\b/.test(normalized)) {
    return {
      definition: 'This heart function test checks how your heart responds during exercise or a controlled stress condition.',
      prep: buildPrep(
        'Wear comfortable clothing and walking shoes.',
        'Avoid a heavy meal, caffeine, or smoking before the test if instructed.',
        'Ask whether any heart medicine should be paused before the appointment.'
      ),
      time: '30 to 60 minutes',
    };
  }

  if (/\bechocardiogram\b|\becho\b|\btte\b|\btee\b/.test(normalized)) {
    return {
      definition: 'This ultrasound test shows how well your heart chambers, valves, and pumping action are working.',
      prep: buildPrep(
        normalized.includes('tee') ? 'Do not eat or drink for 6 hours before a transesophageal study unless told otherwise.' : 'No major preparation is usually needed.',
        'Bring your medication list and previous heart reports.',
        'Wear comfortable clothing for easier access to the chest area.'
      ),
      time: normalized.includes('tee') ? '45 to 60 minutes' : '20 to 40 minutes',
    };
  }

  if (/\becg\b/.test(normalized)) {
    return {
      definition: 'This ECG records the electrical activity of your heart to look for rhythm problems or signs of strain.',
      prep: buildPrep(
        'Avoid heavy chest creams or body oil before the test.',
        'Wear clothing that allows quick access to the chest and ankles.',
        'Try to rest for a few minutes before the recording starts.'
      ),
      time: '5 to 10 minutes',
    };
  }

  if (/\bpacemaker\b/.test(normalized)) {
    return {
      definition: 'This device check reviews how your pacemaker is working and whether its settings or battery need attention.',
      prep: buildPrep(
        'Bring your pacemaker card and any recent reports.',
        'List any symptoms such as dizziness or palpitations for the clinician.',
        'No fasting is usually needed.'
      ),
      time: '15 to 30 minutes',
    };
  }

  return {
    definition: `This cardiac test helps assess heart rhythm, blood flow, or pumping function for ${name}.`,
    prep: buildPrep(
      'Wear comfortable clothing.',
      'Bring your medication list and previous heart test results.',
      'Follow any fasting or medicine instruction given during booking.'
    ),
    time: '15 to 40 minutes',
  };
};

const buildDnaKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bpaternity\b|\bmaternity\b|\bsibling\b/.test(normalized)) {
    return {
      definition: 'This DNA relationship test compares genetic material to confirm whether family members are biologically related.',
      prep: buildPrep(
        'Do not eat, drink, smoke, or chew gum for 30 minutes before a cheek swab.',
        'Bring valid identification for every person being tested.',
        'For legal testing, ensure all required parties attend exactly as instructed.'
      ),
      time: '10 to 20 minutes',
    };
  }

  if (/\bimmigration\b/.test(normalized)) {
    return {
      definition: 'This DNA test supports embassy or immigration family-verification requirements using approved collection procedures.',
      prep: buildPrep(
        'Bring the exact identity documents requested by the clinic or embassy.',
        'Do not eat, drink, smoke, or chew gum for 30 minutes before cheek swab collection.',
        'Arrive on time because chain-of-custody paperwork is usually required.'
      ),
      time: '15 to 25 minutes',
    };
  }

  if (/\bancestry\b|\bethnicity\b/.test(normalized)) {
    return {
      definition: 'This DNA test looks at inherited genetic markers to give information about ancestry and family origins.',
      prep: buildPrep(
        'Avoid food, drink, and smoking for 30 minutes before the sample.',
        'Follow the cheek-swab or saliva collection steps exactly as instructed.',
        'Make sure the sample tube or swab is correctly labelled before submission.'
      ),
      time: '10 to 15 minutes',
    };
  }

  if (/\bpharmacogenomics\b/.test(normalized)) {
    return {
      definition: 'This DNA test looks at genetic differences that may affect how your body responds to certain medicines.',
      prep: buildPrep(
        'No fasting is usually needed.',
        'Bring a current medication list so the result can be interpreted well.',
        'Avoid eating, drinking, or smoking for 30 minutes before a cheek swab if that is the sample type.'
      ),
      time: '10 to 15 minutes',
    };
  }

  return {
    definition: `This DNA test examines genetic material to provide information related to ${name}.`,
    prep: buildPrep(
      'Avoid food, drink, and smoking for 30 minutes before a cheek-swab sample.',
      'Bring valid identification if this is a legal or official test.',
      'Follow the sample-label and consent instructions carefully.'
    ),
    time: '10 to 20 minutes',
  };
};

const buildCancerScreeningKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\bmammogram\b|\bmammography\b/.test(normalized)) {
    return {
      definition: 'This breast imaging test looks for early changes that may need monitoring or treatment, even before symptoms appear.',
      prep: buildPrep(
        'Do not apply deodorant, perfume, powder, or lotion to the chest or underarms on the day of the test.',
        'Wear a two-piece outfit.',
        'Bring previous breast images if available.'
      ),
      time: normalized.includes('3d') ? '20 to 30 minutes' : '15 to 20 minutes',
    };
  }

  if (/\bpap smear\b|\bhpv\b/.test(normalized)) {
    return {
      definition: 'This screening test checks for cervical cell changes or HPV infection that may need follow-up.',
      prep: buildPrep(
        'Avoid sex, douching, and vaginal medicines for 24 to 48 hours before the test.',
        'Try not to book during menstrual bleeding.',
        'Tell the clinician if you are pregnant or have active symptoms.'
      ),
      time: '10 to 15 minutes',
    };
  }

  if (/\bfobt\b|\bfit\b/.test(normalized)) {
    return {
      definition: 'This test checks a stool sample for hidden blood, which can be an early warning sign that needs further review.',
      prep: buildPrep(
        'Use the collection kit exactly as instructed.',
        'Avoid mixing the stool sample with urine or water.',
        'Return the sample as soon as possible after collection.'
      ),
      time: '5 to 10 minutes for sample collection',
    };
  }

  if (/\bcolonoscopy\b/.test(normalized)) {
    return {
      definition: 'This bowel screening test uses a camera to look for polyps, bleeding, inflammation, or early bowel cancer changes.',
      prep: buildPrep(
        'Follow the bowel-preparation instructions exactly.',
        'Use only the allowed clear fluids before the procedure if instructed.',
        'Arrange for someone to take you home if sedation is planned.'
      ),
      time: '30 to 60 minutes, plus recovery time if sedated',
    };
  }

  if (/\bbiopsy\b/.test(normalized)) {
    return {
      definition: 'This biopsy removes a small tissue sample so it can be examined closely for abnormal or cancer-related changes.',
      prep: buildPrep(
        'Follow the fasting or medication guidance given for your procedure.',
        'Tell the team about blood thinners or bleeding disorders before arrival.',
        'Arrange support for the trip home if sedation is planned.'
      ),
      time: '20 to 60 minutes',
    };
  }

  return {
    definition: `This screening-focused test is used to look for early changes related to ${name}.`,
    prep: buildPrep(
      'Follow the booking instructions because preparation varies by test type.',
      'Bring previous reports if this is a follow-up visit.',
      'Tell the team about pregnancy, bleeding disorders, or active infection if relevant.'
    ),
    time: '10 to 30 minutes',
  };
};

const buildNeurologicalKnowledge = (name: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  const normalized = normalizeDiagnosticName(name);

  if (/\beeg\b/.test(normalized)) {
    return {
      definition: 'This test records the brain’s electrical activity to help assess seizures, blackouts, or other neurological symptoms.',
      prep: buildPrep(
        'Wash your hair and avoid hair cream, oil, or gel before the test.',
        'Avoid caffeine if your clinician advised this.',
        'Try to follow any sleep-deprivation instruction exactly if one was given.'
      ),
      time: normalized.includes('video') || normalized.includes('long term') ? 'Several hours to 1 day, depending on the request' : '30 to 60 minutes',
    };
  }

  if (/\bemg\b|\bncs\b/.test(normalized)) {
    return {
      definition: 'This test checks how well your nerves and muscles are sending and receiving signals.',
      prep: buildPrep(
        'Do not apply lotion, cream, or oil to the skin on the day of the test.',
        'Tell the team if you use blood thinners, have a pacemaker, or have a bleeding problem.',
        'Wear loose clothing for easier access to the limbs being tested.'
      ),
      time: normalized.includes('combined') ? '45 to 75 minutes' : '30 to 60 minutes',
    };
  }

  if (/\bvep\b|\baep\b|\bssep\b|\bbera\b|\bevoked\b/.test(normalized)) {
    return {
      definition: 'This nerve pathway test measures how your brain responds to light, sound, or small sensory signals.',
      prep: buildPrep(
        'Wash your hair and avoid styling products if electrodes will be used.',
        'Bring your glasses or hearing aid if you normally use them.',
        'Avoid caffeine right before the test if you were instructed to.'
      ),
      time: '30 to 60 minutes',
    };
  }

  if (/\bsleep study\b|\bpolysomnography\b/.test(normalized)) {
    return {
      definition: 'This overnight test monitors breathing, oxygen, movement, and brain activity while you sleep.',
      prep: buildPrep(
        'Avoid caffeine, alcohol, and daytime naps if your clinician tells you to.',
        'Bring comfortable sleepwear and your regular bedtime medicines.',
        'Wash your hair and avoid heavy skin or hair products before arrival.'
      ),
      time: 'Overnight, usually 6 to 8 hours',
    };
  }

  if (/\bmslt\b/.test(normalized)) {
    return {
      definition: 'This daytime sleep test measures how quickly you fall asleep across several nap sessions.',
      prep: buildPrep(
        'Follow the sleep instructions given after your overnight study.',
        'Avoid caffeine and nicotine as instructed.',
        'Bring enough items to stay comfortably at the clinic for most of the day.'
      ),
      time: 'Most of the day, usually 6 to 8 hours',
    };
  }

  if (/\bmmse\b|\bcognitive\b|\bneuropsychological\b/.test(normalized)) {
    return {
      definition: 'This assessment checks memory, concentration, language, and other thinking skills.',
      prep: buildPrep(
        'Bring your glasses or hearing aid if you use them.',
        'Bring a list of medicines and any previous brain or memory evaluations.',
        'Try to be well-rested before the appointment.'
      ),
      time: normalized.includes('neuropsychological') ? '1 to 3 hours' : '10 to 30 minutes',
    };
  }

  return {
    definition: `This neurological test helps assess brain, nerve, or muscle function related to ${name}.`,
    prep: buildPrep(
      'Follow the booking instructions because preparation varies by test type.',
      'Avoid caffeine or heavy skin products if your clinician advised this.',
      'Bring previous neurology reports if you have them.'
    ),
    time: '30 to 60 minutes',
  };
};

const buildGenericKnowledge = (name: string, categoryId?: string): Pick<DiagnosticKnowledgeEntry, 'definition' | 'prep' | 'time'> => {
  switch (categoryId) {
    case 'laboratory':
      return buildLabKnowledge(name);
    case 'scan-ultrasound':
      return buildUltrasoundKnowledge(name);
    case 'xray':
      return buildXRayKnowledge(name);
    case 'mri':
      return buildMriKnowledge(name);
    case 'ct-scan':
      return buildCtKnowledge(name);
    case 'endoscopy':
      return buildEndoscopyKnowledge(name);
    case 'cardiology-ecg':
      return buildCardiologyKnowledge(name);
    case 'dna-testing':
      return buildDnaKnowledge(name);
    case 'cancer-screening':
      return buildCancerScreeningKnowledge(name);
    case 'neurological':
      return buildNeurologicalKnowledge(name);
    default:
      return {
        definition: FALLBACK_BRIEF,
        prep: buildPrep('Follow the preparation instructions shared during booking or by your clinician.'),
        time: 'Varies by test',
      };
  }
};

const buildDiagnosticKnowledgeEntry = (name: string): DiagnosticKnowledgeEntry => {
  const reference = getReferenceForName(name);
  const categoryId = inferCategoryId(name, reference?.categoryId);
  const category = categoryId ? categoryById.get(categoryId) : undefined;
  const metadataDescription = reference
    ? metadataDescriptionByKey.get(`${reference.categoryId}:${reference.testId}`)
    : undefined;
  const generated = buildGenericKnowledge(name, categoryId);

  return {
    name,
    definition: metadataDescription ?? generated.definition,
    prep: generated.prep,
    time: generated.time,
    categoryId,
    categoryTitle: reference?.categoryTitle ?? category?.title,
  };
};

export const DIAGNOSTIC_KNOWLEDGE: Record<string, DiagnosticKnowledgeEntry> = Object.fromEntries(
  uniqueDiagnosticNames.map((name) => [normalizeDiagnosticName(name), buildDiagnosticKnowledgeEntry(name)])
);

export const EXTRACTED_DIAGNOSTIC_SERVICE_NAMES = uniqueDiagnosticNames;
export const EXTRACTED_DIAGNOSTIC_SERVICE_COUNT = uniqueDiagnosticNames.length;

export const getDiagnosticKnowledgeKey = (name: string) => normalizeDiagnosticName(name);

export function getDiagnosticKnowledge(name: string | null | undefined) {
  if (!name) {
    return {
      name: '',
      definition: FALLBACK_BRIEF,
      prep: ['Follow the preparation instructions shared during booking or by your clinician.'],
      time: 'Varies by test',
    } satisfies DiagnosticKnowledgeEntry;
  }

  return (
    DIAGNOSTIC_KNOWLEDGE[getDiagnosticKnowledgeKey(name)]
    ?? {
      name,
      definition: FALLBACK_BRIEF,
      prep: ['Follow the preparation instructions shared during booking or by your clinician.'],
      time: 'Varies by test',
    }
  );
}
