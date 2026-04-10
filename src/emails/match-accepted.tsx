import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MatchAcceptedEmailProps {
  recipientName: string;
  partnerName: string;
  partnerEmail: string;
  courseName: string;
  matchesUrl: string;
}

export default function MatchAcceptedEmail({
  recipientName,
  partnerName,
  partnerEmail,
  courseName,
  matchesUrl,
}: MatchAcceptedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        You&apos;re matched with {partnerName} in {courseName}!
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <div style={logoBox}>M</div>
            <Heading style={heading}>You&apos;ve got a study partner!</Heading>
          </Section>
          <Section style={contentSection}>
            <Text style={paragraph}>Hi {recipientName},</Text>
            <Text style={paragraph}>
              Great news! You and <strong>{partnerName}</strong> are now matched
              as study partners in <strong>{courseName}</strong>.
            </Text>
            <Section style={contactBox}>
              <Text style={contactLabel}>Your partner&apos;s contact info</Text>
              <Text style={contactName}>{partnerName}</Text>
              <Text style={contactEmail}>{partnerEmail}</Text>
            </Section>
            <Text style={paragraph}>
              Reach out to your new study partner to set up your first study
              session!
            </Text>
            <Section style={buttonContainer}>
              <Link href={matchesUrl} style={button}>
                View your matches
              </Link>
            </Section>
            <Hr style={hr} />
            <Text style={footer}>
              Be respectful and follow our community guidelines when connecting
              with your study partner.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#ffffff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  color: "#00274C",
};

const logoSection = {
  textAlign: "center" as const,
  padding: "40px 20px 20px",
};

const logoBox = {
  display: "inline-block",
  background: "linear-gradient(135deg, #00274C, #FFCB05)",
  borderRadius: "16px",
  width: "50px",
  height: "50px",
  lineHeight: "50px",
  color: "white",
  fontWeight: 900,
  fontSize: "24px",
  textAlign: "center" as const,
};

const heading = {
  marginTop: "16px",
  fontSize: "24px",
  fontWeight: 800,
  color: "#00274C",
};

const contentSection = {
  padding: "0 24px 40px",
};

const paragraph = {
  fontSize: "16px",
  color: "#475569",
  lineHeight: "1.6",
};

const contactBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const contactLabel = {
  fontSize: "12px",
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 8px",
};

const contactName = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#00274C",
  margin: "0 0 4px",
};

const contactEmail = {
  fontSize: "16px",
  color: "#FFCB05",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  display: "inline-block",
  background: "linear-gradient(to right, #00274C, #FFCB05)",
  color: "white",
  fontWeight: 600,
  fontSize: "16px",
  padding: "14px 32px",
  borderRadius: "50px",
  textDecoration: "none",
};

const hr = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "32px 0",
};

const footer = {
  fontSize: "12px",
  color: "#94a3b8",
  textAlign: "center" as const,
};
